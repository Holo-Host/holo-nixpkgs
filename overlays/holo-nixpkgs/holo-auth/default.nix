{ pkgs }:

with pkgs;

let
  inherit (rust.packages.stable) rustPlatform;
in

{
  holo-auth = rustPlatform.buildRustPackage {
    name = "holo-auth";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-auth";
      rev = "dd4ccce07f54413a0ae70b92716be3fb21679a81";
      sha256 = "19579ixcq7gmcba0pd888nqrigcnvq83vn1z9y25vwbaaz9j0c0l";
    };

    cargoSha256 = "1d1b3fnv2767kri0909xbv4wxf71klwdgqcn6zaz9a0pyyvzs3hb";
    
    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}