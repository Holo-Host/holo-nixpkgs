final: previous: with final;

let
  cargo-to-nix = fetchFromGitHub {
    owner = "transumption-unstable";
    repo = "cargo-to-nix";
    rev = "ba6adc0a075dfac2234e851b0d4c2511399f2ef0";
    sha256 = "1rcwpaj64fwz1mwvh9ir04a30ssg35ni41ijv9bq942pskagf1gl";
  };

  gitignore = fetchFromGitHub {
    owner = "hercules-ci";
    repo = "gitignore";
    rev = "6e7569637d699facfdcde91ab5c94bac06d39edc";
    sha256 = "1lz09rmr2yza8bv46ff49226jls6q1rl2x0p11q1940rw4k4bwa9";
  };

  holo-envoy = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "envoy";
    rev = "5667c5ae6b3e1a36e4b1757f8118d18c34df5e32";
    sha256 = "0bvr2lag2wjbw03jblabg18x655skcpqiqbygf52229gvkyjnlbh";
  };

  holochain-rust = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "71cfd9a977f0431a92d5c3fbf365d336a769e673";
    sha256 = "1i9wlx6ypy02a828427lprdp0jb6gn3s4smqk8d7gpshc44x6v0p";
  };

  holochainRust = callPackage holochain-rust {};

  nixpkgs-mozilla = fetchTarball {
    url = "https://github.com/mozilla/nixpkgs-mozilla/archive/dea7b9908e150a08541680462fe9540f39f2bceb.tar.gz";
    sha256 = "0kvwbnwxbqhc3c3hn121c897m89d9wy02s8xcnrvqk9c96fj83qw";
  };

  npm-to-nix = fetchFromGitHub {
    owner = "transumption-unstable";
    repo = "npm-to-nix";
    rev = "662fa58f63428d23bfbcf9c0348f18fc895a3b5a";
    sha256 = "1mqz39fz1pc4xr18f1lzwvx4csw8n1kvbs4didkfdyzd43qnshaq";
  };
in

{
  inherit (callPackage cargo-to-nix {}) buildRustPackage cargoToNix;
  inherit (callPackage gitignore {}) gitignoreSource;
  inherit (callPackage npm-to-nix {}) npmToNix;
  inherit (callPackage "${nixpkgs-mozilla}/package-set.nix" {}) rustChannelOf;

  buildDNA = makeOverridable (callPackage ./build-dna {
    inherit (llvmPackages_8) lld;
    inherit (rust.packages.nightly) rustPlatform;
  });

  mkImage = profile:
    let
      allowCross = config.allowCross or true;

      nixos = import "${pkgs.path}/nixos" {
        configuration = { config, ... }: {
	  imports = [ profile ];

	  nixpkgs.localSystem.system = if allowCross
	    then builtins.currentSystem
	    else config.nixpkgs.hostPlatform.system;
	};
      };

      inherit (nixos.config.system) build;
      inherit (nixos.config.nixpkgs.hostPlatform) system;

      image = if build ? "vm"
        then build.vm
        else if build ? "virtualBoxOVA"
        then build.virtualBoxOVA
        else if build ? "sdImage"
        then build.sdImage
        else if build ? "isoImage"
        then build.isoImage
        else throw "${build} doesn't expose any known image format";

      stopgap = drv: if allowCross
        then drv
        else runCommand drv.name {} ''
          mkdir -p $out

          for f in ${drv}/*; do
            if [ "$f" = "${drv}/nix-support" ]; then
              cp -r $f $out
              chmod -R +w $out/$(basename $f)
            else
              cp -rs $f $out
            fi
          done

          for f in $out/nix-support/*; do
            substituteInPlace $f --replace ${drv} $out
          done
        '';
    in
    lib.recursiveUpdate (stopgap image) {
      meta.platforms = [ system ];
    };

  dnaPackages = recurseIntoAttrs {
    example-happ = callPackage ./dna-packages/example-happ {};
    happ-store = callPackage ./dna-packages/happ-store {};
    holo-hosting-app = callPackage ./dna-packages/holo-hosting-app {};
    holofuel = callPackage ./dna-packages/holofuel {};
    servicelogger = callPackage ./dna-packages/servicelogger {};
  };

  aurora-led = callPackage ./aurora-led {};

  extlinux-conf-builder = callPackage ./extlinux-conf-builder {};

  inherit (callPackage holo-envoy {}) holo-envoy;
  inherit (holochainRust) holochain-cli holochain-conductor;

  holoport-hardware-test = callPackage ./holoport-hardware-test {};

  holoport-nano-dtb = callPackage ./holoport-nano-dtb {
    linux = linux_latest;
  };

  holoportos-initialize = callPackage ./holoportos-initialize {
    stdenv = stdenvNoCC;
    python3 = python3.withPackages (ps: [ ps.requests ps.retry ]);
  };

  holoportos-install = callPackage ./holoportos-install {};

  holoportos-led-daemon = callPackage ./holoportos-led-daemon {};

  hydra = previous.hydra.overrideAttrs (super: {
    doCheck = false;
    patches = [ ./hydra/no-restrict-eval.diff ];
    meta = super.meta // {
      hydraPlatforms = [ "x86_64-linux" ];
    };
  });

  libsodium = previous.libsodium.overrideAttrs (super: {
    # Separate debug output breaks cross-compilation
    separateDebugInfo = false;
  });

  linuxPackages_latest = previous.linuxPackages_latest.extend (self: super: {
    sun50i-a64-gpadc-iio = self.callPackage ./linux-packages/sun50i-a64-gpadc-iio {};
  });

  n3h = callPackage ./n3h {};

  rust = previous.rust // {
    packages = previous.rust.packages // {
      nightly = {
        rustPlatform = final.makeRustPlatform {
          inherit (buildPackages.rust.packages.nightly) cargo rustc;
        };

        cargo = final.rust.packages.nightly.rustc;
        rustc = (rustChannelOf {
          channel = "nightly";
          date = "2019-07-14";
          sha256 = "1llbwkjkjis6rv0rbznwwl0j6bf80j38xgwsd4ilcf0qps4cvjsx";
        }).rust.override {
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
}
