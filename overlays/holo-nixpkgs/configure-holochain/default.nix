{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "3ac4685b3247187b9bd75b467cfbdd13ee80ca5f";
    sha256 = "021k5y476y1jsc99hs4dpn6v3mzaa5q4jzsi2a1bqpavz6vymgvh";
  };

  cargoSha256 = "09zk00mv3jhq3gx44f60i8siff3snm63xgs8jn7ra7iaijbg1cz6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
