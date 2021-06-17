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
      rev = "1445543949b4fc27d3b556426b1167e03389d11a";
      sha256 = "128r3vxhynnx13v46374b66lkvv77xgakjimybiydi50dlssgq80";
    };

    cargoSha256 = "0i9k6cwiim53sgask2n2cgl6l0rl84dcaqqrmdqinxlqr4vi66kp";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}