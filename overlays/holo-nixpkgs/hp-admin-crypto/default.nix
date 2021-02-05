{ pkgs }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
  inherit (darwin.apple_sdk.frameworks) Security;
in

{
  hp-admin-crypto = rustPlatform.buildRustPackage {
    name = "hp-admin-crypto";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "hp-admin-crypto";
      rev = "321833b8711d4141de419fa3d1610165621569a5";
      sha256 = "0pssizqpmyxjwzqgkrd3vdg3r30cvz4zwb23zf895rm7djhq52sn";
    };
    
    cargoSha256 = "1p5y7z0hn1nj67yyx1q7bg0z4s9mqd6cbh0h45cjjlma8widq5sp";

    buildInputs = lib.optionals stdenv.isDarwin [ Security ];
  };
}