{ pkgs }:

with pkgs;

let
  inherit (rust.packages.stable) rustPlatform;
  inherit (darwin.apple_sdk.frameworks) Security;
in

{

  hpos-config = rustPlatform.buildRustPackage {
    name = "hpos-config";

    src = fetchFromGitHub {
        owner = "Holo-Host";
        repo = "hpos-config";
        rev = "91a9e35547f7db492446857fccd83c54e705cb0e";
        sha256 = "010ryvh37aa2wxcshgizasbfhw3g110ghgwvrvnfkv2klclam96s";
    };

    cargoSha256 = "0mzcg419klhn7fab7za0m68m6yzgbazamx611lph4a7saqdmzz9i";

    nativeBuildInputs = [ perl pkgconfig ] ++ stdenv.lib.optionals stdenv.isDarwin [
      xcbuild
    ];

    buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
      AppKit
      Security
      libiconv
    ]);
    
    RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
    RUST_SODIUM_SHARED = "1";

    doCheck = false;
  };
}