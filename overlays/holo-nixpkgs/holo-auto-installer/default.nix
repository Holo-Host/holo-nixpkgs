{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "holo-auto-installer";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auto-installer";
    rev = "3dc051fb5891e9eb2147f68f33767c005bf53802";
    sha256 = "0jzrkvhf0aacynfdvi6770aym1fsgh66b7n04cvcj70x3lq2ryf0";
  };

  cargoSha256 = "0739g0agmlaj2lwnr3ldcrnrhq99fav9z5flnv5ilx5aglqshp6d";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
