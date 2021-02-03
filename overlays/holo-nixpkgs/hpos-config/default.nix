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
        rev = "920bd38401edf0b5e81da489d5e519852d7b3218";
        sha256 = "1sc4jhn4h0phxi1pn20c5wq7x8zs3d8dis9il7fdc5iiszki5413";
    };

    cargoSha256 = "19fk595k9nrqgn5nwfxd0mnzw3is448q2lpgc8m20d92sw2az8fx";

    nativeBuildInputs = [ perl ];

    buildInputs = lib.optionals stdenv.isDarwin [ Security ];

    RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
    RUST_SODIUM_SHARED = "1";

    doCheck = false;
  };
}