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

  npm-to-nix = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "npm-to-nix";
    rev = "6d2cbbc9d58566513019ae176bab7c2aeb68efae";
    sha256 = "1wm9f2j8zckqbp1w7rqnbvr8wh6n072vyyzk69sa6756y24sni9a";
  };
in

rec {
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

  inherit (callPackage npm-to-nix {}) npmToNix;

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

  configure-holochain = callPackage ./configure-holochain {
    inherit (rust.packages.stable) rustPlatform;
  };

  extlinux-conf-builder = callPackage ./extlinux-conf-builder {};

  hc-state = writeShellScriptBin "hc-state" ''
    ${nodejs}/bin/node ${hc-state-node}/main.js "$@"
  '';

  inherit (callPackage ./hc-state-node {}) hc-state-node;

  holo-cli = callPackage ./holo-cli {};

  holo-envoy = callPackage ./holo-envoy {
    inherit (rust.packages.nightly) rustPlatform;
  };

  holo-nixpkgs.path = gitignoreSource ../..;

  holo-nixpkgs-tests = recurseIntoAttrs (
    import "${holo-nixpkgs.path}/tests" { inherit pkgs; }
  );

  inherit (callPackage ./holochain {
    inherit (rust.packages.stable) rustPlatform;
  }) mkHolochainBinary holochain;

  dna-util = mkHolochainBinary { crate = "dna_util"; };

  kitsune-p2p-proxy = mkHolochainBinary { crate = "kitsune_p2p/proxy"; };

  holoport-nano-dtb = callPackage ./holoport-nano-dtb {};

  inherit (callPackage ./host-console-ui {}) host-console-ui;

  hpos-install = callPackage ./hpos-install {};

  hpos = recurseIntoAttrs {
    buildImage = imports:
      buildImage (imports ++ [ hpos.logical ]);

    logical = "${holo-nixpkgs.path}/profiles/logical/hpos";
    physical = "${holo-nixpkgs.path}/profiles/physical/hpos";

    qemu = (hpos.buildImage [ "${hpos.physical}/vm/qemu" ]) // {
      meta.platforms = [ "x86_64-linux" ];
    };

    # virtualbox = (hpos.buildImage [ "${hpos.physical}/vm/virtualbox" ]) // {
    #   meta.platforms = [ "x86_64-linux" ];
    # };
  };

  hpos-admin-api = callPackage ./hpos-admin-api {
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

  lair-keystore = callPackage ./lair-keystore {
    inherit (rust.packages.stable) rustPlatform;
  };

  libsodium = previous.libsodium.overrideAttrs (
    super: {
      # Separate debug output breaks cross-compilation
      separateDebugInfo = false;
    }
  );

  linuxPackages = previous.linuxPackages.extend (
    self: super: {
      sun50i-a64-gpadc-iio = self.callPackage ./linux-packages/sun50i-a64-gpadc-iio {};
    }
  );

  nginx = nginxStable;

  nodejs = nodejs-12_x;

  rust = previous.rust // (let
    targets = [
      "aarch64-unknown-linux-musl"
      "wasm32-unknown-unknown"
      "x86_64-pc-windows-gnu"
      "x86_64-unknown-linux-musl"
    ];

    rustNightly = (rustChannelOf {
      channel = "nightly";
      date = "2019-11-16";
      sha256 = "17l8mll020zc0c629cypl5hhga4hns1nrafr7a62bhsp4hg9vswd";
    }).rust.override { inherit targets; };

    rustStable = (rustChannelOf {
      channel = "1.48.0";
      sha256 = "0b56h3gh577wv143ayp46fv832rlk8yrvm7zw1dfiivifsn7wfzg";
    }).rust.override { inherit targets; };
  in {
    packages = previous.rust.packages // {
      nightly = {
        rustPlatform = final.makeRustPlatform {
          rustc = rustNightly;
          cargo = rustNightly;
        };

        inherit (final.rust.packages.nightly.rustPlatform) rust;
      };

      stable = {
        rustPlatform = final.makeRustPlatform {
          rustc = rustStable;
          cargo = rustStable;
        };

        inherit (final.rust.packages.stable.rustPlatform) rust;
      };
    };
  });

  inherit (callPackage ./hpos-holochain-api {}) hpos-holochain-api;

  # here for testing purposes only for trycp_server installation
  tryorama = callPackage ./tryorama {
    inherit (rust.packages.stable) rustPlatform;
  };

  hpos-holochain-client = callPackage ./hpos-holochain-client {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.click ps.requests ]);
  };

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
