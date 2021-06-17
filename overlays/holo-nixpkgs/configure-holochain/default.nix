{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "31a339e961bbe7b9177f3a721b5d29801c0d274b";
    sha256 = "1m68nqww9gz2hki4n3xv86c6wr1kgf7snbbf7nnsbb26dhb5qlhm";
  };

  cargoSha256 = "1n9pywziayyhvr2sjp595psh5niahvdl2d1lmblklkvarbp58c1d";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
