{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "0d9d6dca334e43179814b8a909ecf3fe26b50325";
    sha256 = "1ggyl1wrf7g1k155xfyp5qv7mx17jh8lgq25pnl98qp95zk7yjpv";
  };

  cargoSha256 = "178bd64if1wajmlna2ws7687majwwc1gx7xl1dl8i0ss17mx2wj0";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
