final: previous:

with final;
with lib;

let
  aorura = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "aorura";
    rev = "2aef90935d6e965cf6ec02208f84e4b6f43221bd";
    sha256 = "00d9c6f0hh553hgmw01lp5639kbqqyqsz66jz35pz8xahmyk5wmw";
  };

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

  holo-auth = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auth";
    rev = "43009e8ab644621dd4272c4723d0e603412f062b";
    sha256 = "1c8p9xjhfxgh11vf55fwkglffv0qjc8gzc98kybqznhm81l8y2fl";
  };

  holo-router = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-router";
    rev = "01421a799a2df06272307fc322f86e73595ff006";
    sha256 = "1qv9h82gl8lcm3kbkkq0gskd38c5msp9lxz5hvaxj6q8amc8884v";
  };

  hp-admin = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hp-admin";
    rev = "e8cad8561580e028d917685539f44d53025c4ea5";
    sha256 = "0mvhlgp6nlv069wvbc5nbd8229i3fjzyk0qszlmkv9hp0jyph51y";
  };

  hp-admin-crypto = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hp-admin-crypto";
    rev = "321833b8711d4141de419fa3d1610165621569a5";
    sha256 = "0pssizqpmyxjwzqgkrd3vdg3r30cvz4zwb23zf895rm7djhq52sn";
  };

  hpos-config = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-config";
    rev = "920bd38401edf0b5e81da489d5e519852d7b3218";
    sha256 = "1sc4jhn4h0phxi1pn20c5wq7x8zs3d8dis9il7fdc5iiszki5413";
  };

  nixpkgs-mozilla = fetchTarball {
    url = "https://github.com/mozilla/nixpkgs-mozilla/archive/dea7b9908e150a08541680462fe9540f39f2bceb.tar.gz";
    sha256 = "0kvwbnwxbqhc3c3hn121c897m89d9wy02s8xcnrvqk9c96fj83qw";
  };

  npm-to-nix = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "npm-to-nix";
    rev = "6d2cbbc9d58566513019ae176bab7c2aeb68efae";
    sha256 = "1wm9f2j8zckqbp1w7rqnbvr8wh6n072vyyzk69sa6756y24sni9a";
  };
in

{ 
  yarn2nix = yarn2nix-moretea;
 
  inherit (callPackage aorura {})
    aorura-cli
    aorura-emu
    ;

  inherit (callPackage cargo-to-nix {})
    buildRustPackage
    cargoToNix
    ;

  inherit (callPackage gitignore {}) gitignoreSource;

  inherit (callPackage holo-auth {}) holo-auth-client;

  inherit (callPackage holo-router {})
    holo-router-agent
    holo-router-gateway
    ;

  inherit (callPackage hp-admin {}) hp-admin-ui;

  inherit (callPackage hp-admin-crypto {}) hp-admin-crypto-server;

  inherit (callPackage hpos-config {})
    hpos-config-gen-cli
    hpos-config-into-base36-id
    hpos-config-is-valid
    ;

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

  hydra = previous.hydra.overrideAttrs (
    super: {
      doCheck = false;
      patches = [
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

  magic-wormhole-mailbox-server = python3Packages.callPackage ./magic-wormhole-mailbox-server {};

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
