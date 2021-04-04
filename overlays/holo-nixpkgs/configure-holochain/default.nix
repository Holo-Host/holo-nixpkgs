{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "ce60bfa85414a2c0eaa4bd691ae94b56b4895120";
    sha256 = "061rp2ynxwgraswgrxcyj0iqasvhlyf4nijhy3if557il9j58yzz";
  };

  cargoSha256 = "0sa1fzaavrr5x5i6cm2yg4v0anb43rvl8lqqj5rc1ga48pb3b5q3";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
