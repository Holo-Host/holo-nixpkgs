{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "baaaba1175ff403d6d0dfeed84631da2b708f0a3";
    sha256 = "1rrbhlqrin0k7blaczrl8zpvbsnzy752fpk4rk49g8swj7dsrzqy";
  };

  cargoSha256 = "1d0z20mv61crlww8a2bsvbhr1ajixgxh3d0wn4lnfnp08c4z3w4l";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
