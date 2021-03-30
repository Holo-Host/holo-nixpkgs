{ pkgs }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
  inherit (darwin.apple_sdk.frameworks) Security;
in

{

  hpos-config = rustPlatform.buildRustPackage {
    name = "hpos-config";

    src = fetchFromGitHub {
        owner = "Holo-Host";
        repo = "hpos-config";
        rev = "a5dae5872f010be77a896247d55d35bf9a01978b";
        sha256 = "1yzk4wg3h778y0yh3nz13m115qg21i3rl6g2903h5k1pbxmiyi5h";
    };

    cargoSha256 = "1jc2ksdw1i6rh4q6bc1gxdxxa04g901289chhlq8alf1mcl7z9cd";

    nativeBuildInputs = [ perl ];

    buildInputs = lib.optionals stdenv.isDarwin [ Security darwin.libiconv ];

    RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
    RUST_SODIUM_SHARED = "1";

    doCheck = false;
  };
}