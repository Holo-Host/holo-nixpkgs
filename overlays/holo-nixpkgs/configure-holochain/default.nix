{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "63d583e1de7dcbe624f72c29262f50dff84c2c98";
    sha256 = "04piq5y8qfg2y31cy2ynj3ymz4y160wlqwvh28c9mblszxv0kvy1";
  };

  cargoSha256 = "0fkig5vdbkmj54gxrs2g6bzdaha6j050mmjs1mzwp24mck9mnabx";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
