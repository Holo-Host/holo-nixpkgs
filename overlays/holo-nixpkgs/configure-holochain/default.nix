{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "cfbd0ca7af6e9efc5ad2ef1d97a9b0b054fc52ba";
    sha256 = "1aic7vwasfjz3crnjnf355jqpfi3s7yqsxb6rbn6xb1sgvz1578g";
  };

  cargoSha256 = "178bd64if1wajmlna2ws7687majwwc1gx7xl1dl8i0ss17mx2wj0";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
