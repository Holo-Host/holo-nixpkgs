{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "c16dcb892c48de3afeee5bfc1dd338d2a288774b";
    sha256 = "1k520njrd28pmgqgv31kc5s4ca3v1ngvrq826cfxar3xp2wgllzq";
  };

  cargoSha256 = "032wlg9alikbscd5pliv98gc78lxwfzbz8wj5ircxqbxliiln89q";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
