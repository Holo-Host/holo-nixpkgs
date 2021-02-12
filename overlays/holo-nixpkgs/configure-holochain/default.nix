{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "d7576f528cb08675c25d2552ac26c8c67e729980";
    sha256 = "0plplw4krwmzcc81zq4609lmnxv9594ggn4s4njlmvgla5hchfnm";
  };

  cargoSha256 = "178bd64if1wajmlna2ws7687majwwc1gx7xl1dl8i0ss17mx2wj0";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
