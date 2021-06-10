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
      rev = "9258b273d974981b73354d3d216e21f642b056af";
      sha256 = "17b6va39jab7w18gfrn8y3b9qxv8298jbykr900lpn0y614zgjl0";
    };

    cargoSha256 = "0i9k6cwiim53sgask2n2cgl6l0rl84dcaqqrmdqinxlqr4vi66kp";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}