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
      rev = "f857a0b8dfeb21e30ef6a0eed72e6b70a6a5d2ae";
      sha256 = "0110k1cgd6jcqwn1n6im3b8s6vyrfcr852p0qmd1smc8fs16wnda";
    };

    cargoSha256 = "0i9k6cwiim53sgask2n2cgl6l0rl84dcaqqrmdqinxlqr4vi66kp";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}