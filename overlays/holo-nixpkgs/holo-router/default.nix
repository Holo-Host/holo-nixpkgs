{ pkgs }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
in

{
  holo-router = rustPlatform.buildRustPackage {
    name = "holo-router";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-router";
      rev = "9d99427a4321e02453937afcf7d4e47e22182e62";
      sha256 = "17zj84ws966v1gfcfbgzwg1517c5rq8jv9j3j35g14wswyvvrnqy";
    };

    cargoSha256 = "0i9k6cwiim53sgask2n2cgl6l0rl84dcaqqrmdqinxlqr4vi66kp";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}