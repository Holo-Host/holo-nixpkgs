final: previous:

with final;
with lib;

let
  cargo-to-nix = fetchFromGitHub {
    owner = "transumption-unstable";
    repo = "cargo-to-nix";
    rev = "ba6adc0a075dfac2234e851b0d4c2511399f2ef0";
    sha256 = "1rcwpaj64fwz1mwvh9ir04a30ssg35ni41ijv9bq942pskagf1gl";
  };

  chaperone = fetchFromGitHub {
    owner = "holo-host";
    repo = "chaperone";
    rev = "2386e905dc60dbb2bff482b92d5fbeb418627931";
    sha256 = "02yxlqcgly3235pj6rb84px1my3ps3m5plk0nijazpiakndh2nxz";
  };

  gitignore = fetchFromGitHub {
    owner = "hercules-ci";
    repo = "gitignore";
    rev = "f9e996052b5af4032fe6150bba4a6fe4f7b9d698";
    sha256 = "0jrh5ghisaqdd0vldbywags20m2cxpkbbk5jjjmwaw0gr8nhsafv";
  };

  holo-envoy = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "envoy";
    rev = "52b0b34907474ef39f123c855ed6caae89b63396";
    sha256 = "0648bmv33cmb53ppn3ph44v52yx19qd6nnjskgmkyk05xmgd391y";
  };

  holo-router = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-router";
    rev = "66b2dd874997b1f5739ab15244b14cb58f303444";
    sha256 = "0ap3ij1ig6qwd7b4f0xlmgx5221ysdpy7ig2wgcqrh5djylzgzrm";
  };

  holochain-rust = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "e33624e0e3cb23158212590ee89d6aaa7ca86e2e";
    sha256 = "1bjkl623r0y2ybibnxma2j1mp8rhr3zwav96f9jq34f2vqyw0vj8";
  };

  hp-admin = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hp-admin";
    rev = "4ae0f0cc28e199a5d8f4d23f2aa508aae2cf5111";
    sha256 = "1abna46da9av059kfy10ls0fa6ph8vhh75rh8cv3mvi96m2n06zd";
  };

  hp-admin-crypto = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hp-admin-crypto";
    rev = "1e9d8fad9382343153497ff2a673f62357dfa066";
    sha256 = "0ssxra8i7kx7bp6mjs6rmi24qj3jf6zrqp4kz5x0sbqxah23742p";
  };

  hpos-state = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-state";
    rev = "bdb23a5f748ca77875e26103a92dbe95c27ee2c8";
    sha256 = "0if7j38pxb1vll9g326ra27d0fnkflclbmg3spjdmyyhb779xgiz";
  };

  nixpkgs-mozilla = fetchTarball {
    url = "https://github.com/mozilla/nixpkgs-mozilla/archive/dea7b9908e150a08541680462fe9540f39f2bceb.tar.gz";
    sha256 = "0kvwbnwxbqhc3c3hn121c897m89d9wy02s8xcnrvqk9c96fj83qw";
  };

  npm-to-nix = fetchFromGitHub {
    owner = "transumption-unstable";
    repo = "npm-to-nix";
    rev = "6d2cbbc9d58566513019ae176bab7c2aeb68efae";
    sha256 = "1wm9f2j8zckqbp1w7rqnbvr8wh6n072vyyzk69sa6756y24sni9a";
  };
in

{
  inherit (callPackage cargo-to-nix {})
    buildRustPackage
    cargoToNix
    ;

  inherit (callPackage chaperone {}) chaperone;

  inherit (callPackage gitignore {}) gitignoreSource;

  inherit (callPackage holo-router {})
    holo-router-agent
    holo-router-gateway
    ;

  inherit (callPackage hp-admin {})
    hp-admin-ui
    holofuel-ui
    ;

  inherit (callPackage hp-admin-crypto {}) hp-admin-crypto-server;

  inherit (callPackage hpos-state {})
    hpos-state-derive-keystore
    hpos-state-gen-cli
    hpos-state-gen-web
    ;

  inherit (callPackage npm-to-nix {}) npmToNix;

  inherit (callPackage "${nixpkgs-mozilla}/package-set.nix" {}) rustChannelOf;

  buildDNA = makeOverridable (
    callPackage ./build-dna {
      inherit (rust.packages.nightly) rustPlatform;
    }
  );

  buildHoloPortOS = hardware:
    buildImage [ holoportos.profile hardware ];

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

  singletonDir = path:
    let
      drv = lib.toDerivation path;
    in
      runCommand "singleton" {} ''
        mkdir $out
        ln -s ${path} $out/${drv.name}
      '';

  tryDefault = x: default:
    let
      eval = builtins.tryEval x;
    in
      if eval.success then eval.value else default;

  writeJSON = config: writeText "config.json" (builtins.toJSON config);

  writeTOML = config: runCommand "config.toml" {} ''
    ${remarshal}/bin/json2toml < ${writeJSON config} > $out
  '';

  dnaHash = dna: builtins.readFile (
    runCommand "${dna.name}-hash" {} ''
      ${holochain-cli}/bin/hc hash -p ${dna}/${dna.name}.dna.json \
        | tail -1 \
        | cut -d ' ' -f 3- \
        | tr -d '\n' > $out
    ''
  );

  dnaPackages = recurseIntoAttrs (
    import ./dna-packages final previous
  );

  aurora-led = callPackage ./aurora-led {};

  dnscrypt-proxy2 = callPackage ./dnscrypt-proxy2 {};

  extlinux-conf-builder = callPackage ./extlinux-conf-builder {};

  inherit (callPackage holo-envoy {}) holo-envoy;

  inherit (callPackage holochain-rust {})
    holochain-cli
    holochain-conductor
    sim2h-server
    ;

  hclient = callPackage ./hclient {};

  holofuel-app = callPackage ./holofuel-app {};

  holoport-hardware-test = callPackage ./holoport-hardware-test {};

  holoport-nano-dtb = callPackage ./holoport-nano-dtb {
    linux = linux_latest;
  };

  holo-auth-client = callPackage ./holo-auth-client {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.requests ]);
  };

  holo-nixpkgs-tests = recurseIntoAttrs (
    import ../../tests {
      inherit pkgs;
    }
  );

  holoportos = recurseIntoAttrs {
    profile = tryDefault <nixos-config> ../../profiles/holoportos;

    qemu = (buildHoloPortOS ../../profiles/hardware/qemu) // {
      meta.platforms = [ "aarch64-linux" "x86_64-linux" ];
    };

    virtualbox = (buildHoloPortOS ../../profiles/hardware/virtualbox) // {
      meta.platforms = [ "x86_64-linux" ];
    };
  };

  holoportos-install = callPackage ./holoportos-install {};

  hpos-admin = callPackage ./hpos-admin {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.flask ps.gevent ]);
  };

  hpos-admin-client = callPackage ./hpos-admin-client {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.click ps.requests ]);
  };

  hpos-init = callPackage ./hpos-init {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.magic-wormhole ]);
  };

  hpos-led-daemon = callPackage ./hpos-led-daemon {};

  hpstatus = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpstatus";
    rev = "005435217305f76f3d51722f462f310a2baeab11";
    sha256 = "1gszq98xdvq515g2kaxan886p4cgmwgqmb0g7b9a66m5087p3jg4";
  };

  hydra = previous.hydra.overrideAttrs (
    super: {
      doCheck = false;
      patches = [
        ./hydra/logo-vertical-align.diff
        ./hydra/no-restrict-eval.diff
      ];
      meta = super.meta // {
        hydraPlatforms = [ "x86_64-linux" ];
      };
    }
  );

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
            date = "2019-07-14";
            sha256 = "1llbwkjkjis6rv0rbznwwl0j6bf80j38xgwsd4ilcf0qps4cvjsx";
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

  wrangler = callPackage ./wrangler {};

  wrapDNA = drv: runCommand (lib.removeSuffix ".dna.json" drv.name) {} ''
    install -Dm -x ${drv} $out/${drv.name}
  '';

  zerotierone = previous.zerotierone.overrideAttrs (
    super: {
      meta = with lib; super.meta // {
        platforms = platforms.linux;
        license = licenses.free;
      };
    }
  );
}
