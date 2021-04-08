{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "6e7af120bf2fe25a725ed48422a2df9a894a8548";
    sha256 = "1vmlj6qbww1w7j9s7bdxwdyj640dmd6if0bxl8n2nb2wjfjhks17";
  };

  cargoSha256 = "0wh1nvq274wn2xxx9gnixv9z47dznkd7r6xazyvn56as7j0ypj6w";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
