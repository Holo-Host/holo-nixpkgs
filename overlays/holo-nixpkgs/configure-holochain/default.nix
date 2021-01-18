{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "3f8c72f33d6582ef6d2542fc0628ba5f6616bb08";
    sha256 = "1bpj3z193c97cgv7snzz65r0g5ip05j8ryc0k2lxjdzfh98i7wlb";
  };

  cargoSha256 = "178bd64if1wajmlna2ws7687majwwc1gx7xl1dl8i0ss17mx2wj0";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
