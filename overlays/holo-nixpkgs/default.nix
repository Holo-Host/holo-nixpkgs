final: previous:

with final;
with lib;

let
  cargo-to-nix = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "cargo-to-nix";
    rev = "ba6adc0a075dfac2234e851b0d4c2511399f2ef0";
    sha256 = "1rcwpaj64fwz1mwvh9ir04a30ssg35ni41ijv9bq942pskagf1gl";
  };

  gitignore = fetchFromGitHub {
    owner = "hercules-ci";
    repo = "gitignore";
    rev = "f9e996052b5af4032fe6150bba4a6fe4f7b9d698";
    sha256 = "0jrh5ghisaqdd0vldbywags20m2cxpkbbk5jjjmwaw0gr8nhsafv";
  };

  hp-admin = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hp-admin";
    rev = "e8cad8561580e028d917685539f44d53025c4ea5";
    sha256 = "0mvhlgp6nlv069wvbc5nbd8229i3fjzyk0qszlmkv9hp0jyph51y";
  };

  nixpkgs-mozilla = fetchTarball {
    url = "https://github.com/mozilla/nixpkgs-mozilla/archive/8c007b60731c07dd7a052cce508de3bb1ae849b4.tar.gz";
    sha256 = "1zybp62zz0h077zm2zmqs2wcg3whg6jqaah9hcl1gv4x8af4zhs6";
  };
in

{
  inherit (callPackage ./aorura {}) aorura;

  inherit (callPackage cargo-to-nix {})
    buildRustPackage
    cargoToNix
    ;

  inherit (callPackage gitignore {}) gitignoreSource;

  inherit (callPackage ./holo-auth {}) holo-auth;

  inherit (callPackage ./holo-router {}) holo-router;

  inherit (callPackage hp-admin {}) hp-admin-ui;

  inherit (callPackage ./hp-admin-crypto {}) hp-admin-crypto;

  inherit (callPackage ./hpos-config {}) hpos-config;

  inherit (callPackage "${nixpkgs-mozilla}/package-set.nix" {}) rustChannelOf;

  buildImage = imports:
    let
      system = nixos {
        inherit imports;
      };

      imageNames = filter (name: hasAttr name system) [
        "isoImage"
        "sdImage"
        "virtualBoxOVA"
        "vm"
      ];
    in
      head (attrVals imageNames system);

  mkJobsets = callPackage ./mk-jobsets {};

  mkRelease = src: platforms:
    let
      buildMatrix =
        lib.mapAttrs (_: pkgs: import src { inherit pkgs; }) platforms;
    in
      {
        aggregate = releaseTools.channel {
          name = "aggregate";
          inherit src;

          constituents = with lib;
            concatMap (collect isDerivation) (attrValues buildMatrix);
        };

        platforms = buildMatrix;
      };

  tryDefault = x: default:
    let
      eval = builtins.tryEval x;
    in
      if eval.success then eval.value else default;

  writeJSON = config: writeText "config.json" (builtins.toJSON config);

  writeTOML = config: runCommand "config.toml" {} ''
    ${remarshal}/bin/json2toml < ${writeJSON config} > $out
  '';

  holo = recurseIntoAttrs {
    buildProfile = profile: buildImage [
      "${holo-nixpkgs.path}/profiles/logical/holo/${profile}"
      "${pkgs.path}/nixos/modules/virtualisation/qemu-vm.nix"
    ];

    hydra-master = holo.buildProfile "hydra/master";
    hydra-minion = holo.buildProfile "hydra/minion";
    router-gateway = holo.buildProfile "router-gateway";
    wormhole-relay = holo.buildProfile "wormhole-relay";
  };
  
  extlinux-conf-builder = callPackage ./extlinux-conf-builder {};

  holo-cli = callPackage ./holo-cli {};

  holo-envoy = callPackage ./holo-envoy {
    inherit (rust.packages.nightly) rustPlatform;
  };

  holo-nixpkgs.path = gitignoreSource ../..;

  holo-nixpkgs-tests = recurseIntoAttrs (
    import "${holo-nixpkgs.path}/tests" { inherit pkgs; }
  );

  # holochain RSM requires version of rust matching holonix, which is set under rust.packages.holochain-rsm
  holochain = callPackage ./holochain {
    inherit (darwin.apple_sdk.frameworks) CoreServices Security;
    inherit (rust.packages.holochain-rsm) rustPlatform;
  };

  holoport-nano-dtb = callPackage ./holoport-nano-dtb {
    linux = linux_latest;
  };

  inherit (callPackage ./host-console-ui {}) host-console-ui;

  hpos = recurseIntoAttrs {
    buildImage = imports:
      buildImage (imports ++ [ hpos.logical ]);

    logical = "${holo-nixpkgs.path}/profiles/logical/hpos";
    physical = "${holo-nixpkgs.path}/profiles/physical/hpos";

    qemu = (hpos.buildImage [ "${hpos.physical}/vm/qemu" ]) // {
      meta.platforms = [ "x86_64-linux" ];
    };

    virtualbox = (hpos.buildImage [ "${hpos.physical}/vm/virtualbox" ]) // {
      meta.platforms = [ "x86_64-linux" ];
    };
  };

  hpos-admin = callPackage ./hpos-admin {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: with ps; [ http-parser flask gevent toml requests websockets ]);
  };

  hpos-admin-client = callPackage ./hpos-admin-client {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.click ps.requests ]);
  };

  hpos-init = python3Packages.callPackage ./hpos-init {};

  hpos-led-manager = callPackage ./hpos-led-manager {
    inherit (rust.packages.nightly) rustPlatform;
  };

  hpos-reset = writeShellScriptBin "hpos-reset" ''
    rm -rf /var
    reboot
  '';

  inherit (callPackage ./hpos-update {}) hpos-update-cli;

  hydra = let
    hydraUnpatched = previous.hydra-unstable;
  in hydraUnpatched.overrideAttrs (
    super: {
      doCheck = false;
      patches = [
        # upstreamed: ./hydra/fix-declarative-jobsets-type.patch
        # upstreamed: ./hydra/fix-eval-jobs-build.patch
        ./hydra/logo-vertical-align.diff
        ./hydra/no-restrict-eval.diff
        ./hydra/secure-github.diff
      ];
      meta = super.meta // {
        hydraPlatforms = [ "x86_64-linux" ];
      };
    }
  );

  # holochain RSM requires version of rust matching holonix, which is set under rust.packages.holochain-rsm
  lair-keystore = callPackage ./lair-keystore {
    inherit (rust.packages.holochain-rsm) rustPlatform;
  };

  libsodium = previous.libsodium.overrideAttrs (
    super: {
      # Separate debug output breaks cross-compilation
      separateDebugInfo = false;
    }
  );

  linuxPackages_latest = previous.linuxPackages_latest.extend (
    self: super: {
      sun50i-a64-gpadc-iio = self.callPackage ./linux-packages/sun50i-a64-gpadc-iio {};
    }
  );

  nginx = nginxStable;

  nginxStable = (callPackage "${pkgs.path}/pkgs/servers/http/nginx/stable.nix" {}).overrideAttrs (super: {
    patches = super.patches ++ [ ./nginx/add-wasm-mime-type.patch ];
  });

  nodejs = nodejs-12_x;

  rust = previous.rust // {
    packages = previous.rust.packages // {
      nightly = {
        rustPlatform = final.makeRustPlatform {
          inherit (buildPackages.rust.packages.nightly) cargo rustc;
        };

        cargo = final.rust.packages.nightly.rustc;
        rustc = (
          rustChannelOf {
            channel = "nightly";
            date = "2019-11-16";
            sha256 = "17l8mll020zc0c629cypl5hhga4hns1nrafr7a62bhsp4hg9vswd";
          }
        ).rust.override {
          targets = [
            "aarch64-unknown-linux-musl"
            "wasm32-unknown-unknown"
            "x86_64-pc-windows-gnu"
            "x86_64-unknown-linux-musl"
          ];
        };
      };
      holochain-rsm = {
        rustPlatform = final.makeRustPlatform {
          inherit (buildPackages.rust.packages.holochain-rsm) cargo rustc;
        };

        cargo = final.rust.packages.holochain-rsm.rustc;
        rustc = (
          rustChannelOf {
            channel = "stable";
            date = "2020-08-03";
            sha256 = "0yvh2ck2vqas164yh01ggj4ckznx04blz3jgbkickfgjm18y269j";
          }
        ).rust.override {
          targets = [
            "aarch64-unknown-linux-musl"
            "wasm32-unknown-unknown"
            "x86_64-pc-windows-gnu"
            "x86_64-unknown-linux-musl"
          ];
        };
      };
    };
  };

  inherit (callPackage ./self-hosted-happs {}) self-hosted-happs-node;

  wrangler = callPackage ./wrangler {};

  zerotierone = previous.zerotierone.overrideAttrs (
    super: {
      meta = with lib; super.meta // {
        platforms = platforms.linux;
        license = licenses.free;
      };
    }
  );
}
