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
        rev = "dd8b8e7a9261ac1e3613859b2deed57823a803e0";
        sha256 = "1dzjiffkaq6rqnr4ik0ys1xvapp30hs9cn2v9600c1nah97p7601";
    };

    cargoSha256 = "0yhiq52bb6kv8gyqz61d5gqzgzsywg3j1kaz5p5yny0dbc0a03kk";

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