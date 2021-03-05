{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "fb8511d8d8231b777f31cbcfd51918ce6fd2a30c";
    sha256 = "0c8if51x1jrw6jf7gdm6b4dqjar9j5pajb7h0lnfdhx1d7lhw5cl";
  };

  cargoSha256 = "178bd64if1wajmlna2ws7687majwwc1gx7xl1dl8i0ss17mx2wj0";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
