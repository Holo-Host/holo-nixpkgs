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
      rev = "01421a799a2df06272307fc322f86e73595ff006";
      sha256 = "1qv9h82gl8lcm3kbkkq0gskd38c5msp9lxz5hvaxj6q8amc8884v";
    };
    
    cargoSha256 = "0i9k6cwiim53sgask2n2cgl6l0rl84dcaqqrmdqinxlqr4vi66kp";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}