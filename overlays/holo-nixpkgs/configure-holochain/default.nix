{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "e4fc330f142b17baa495ff37f908c6f010e43a89";
    sha256 = "1f5g3ifp9v04sv5gkw31z6aw5z4p41m2n7w953901585yg9ybv35";
  };

  cargoSha256 = "09zk00mv3jhq3gx44f60i8siff3snm63xgs8jn7ra7iaijbg1cz6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
