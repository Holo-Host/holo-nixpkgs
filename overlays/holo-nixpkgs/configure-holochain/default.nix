{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "d97554622bc757d32604b3f6b53aed922260b2a6";
    sha256 = "0paqdv7zc56ygj0x9ij3bi925766fv62ac23pip5zhs5ms2zwclg";
  };

  cargoSha256 = "038hfp6fmjh4qsnya777d4fcwhjysvvyypz6yndqdk9p0afn2pg8";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
