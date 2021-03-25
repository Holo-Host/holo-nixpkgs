{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "c956d623f8791dcc39a96c69544a1e198a5adb0f";
    sha256 = "1ll8ajlh9534x73av0ssbkxm495pxnjnxgvgbg908ks47qqdqrk4";
  };

  cargoSha256 = "09zk00mv3jhq3gx44f60i8siff3snm63xgs8jn7ra7iaijbg1cz6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
