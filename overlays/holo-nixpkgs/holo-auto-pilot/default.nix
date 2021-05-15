{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "holo-auto-pilot";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auto-pilot";
    rev = "e5833b28cfe894e1a5616400782cb3f4545a835a";
    sha256 = "1qwhp14xcjdig8rymv0r2z0hz5fkbjijq8adgchjxr90dis2kivr";
  };

  cargoSha256 = "0s2fzy9903z3s107asv8jkkw020l7k5vkc9kv86fv8jg76zdllas";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
