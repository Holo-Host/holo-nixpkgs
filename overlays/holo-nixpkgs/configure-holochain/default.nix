{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "0b0afa8f6832cb56b8e76b0f6fcabe289237c222";
    sha256 = "061rp2ynxwgraswgrxcyj0iqasvhlyf4nijhy3if557il9j58yza";
  };

  cargoSha256 = "0sa1fzaavrr5x5i6cm2yg4v0anb43rvl8lqqj5rc1ga48pb3b5qa";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
