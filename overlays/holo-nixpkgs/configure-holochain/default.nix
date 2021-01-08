{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "b80fcb0b1fa7574e7aea022931c67364b0f82751";
    sha256 = "00sd1mn1bql2ydwcfrbyjm1gqsxyk7yyvdi3f6b4sczdv0ahxksq";
  };

  cargoSha256 = "0cjx904pwa9vczr2gvp1ifshl1vkq4fxc0r9djl2mjzi8x4aa8ak";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
