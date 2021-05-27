{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "holo-auto-installer";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auto-installer";
    rev = "5020f89dcab36026597eb723fe32aa94c94518da";
    sha256 = "19alaa1a2z12vy5y97lm62q3g8ln0bxyblrndmap3622y1pc817z";
  };

  cargoSha256 = "0kwldg2qa6i2f8ih6yhwzm6m59683zg551w962qvyhcm9xyny283";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
