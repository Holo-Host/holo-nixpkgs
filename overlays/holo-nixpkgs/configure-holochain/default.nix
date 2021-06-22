{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "afe03255005eef43a541b532c856dcb37da22076";
    sha256 = "0xm3nkydgilbi0m25c1kk9rk9zp5z5r5gvpdfjv8ymxg2fmjfz13";
  };

  cargoSha256 = "1yijzanxfzyqyvqv9ygwhq2abk5qpvsis0a7ddgapva8k6q51b2q";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
