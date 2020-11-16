{ pkgs }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
in

{
  hpos-configure-holochain = rustPlatform.buildRustPackage {
    name = "hpos-configure-holochain";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "hpos-configure-holochain";
      rev = "94f9633ac5bc07a93b622ddf2b1e54837e4c6f72";
      sha256 = "1a9ng7pgf7zdrsy52p44ji0kvb11mb89cf8pm162diki475pgvn3";
    };

    cargoSha256 = "1wa2fvbpr0gdsx7mplf8y6j2g3jz9wf0j24h6r9s7annia176yls";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}
