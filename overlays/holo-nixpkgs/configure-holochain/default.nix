{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "95069fa59bedc5d55076a79925f5b74c25f50c5a";
    sha256 = "1d5ylr8mcam5a4kah7p1kgy29wcihdcnsmggiyx3nabzv8bss4zq";
  };

  cargoSha256 = "0wh1nvq274wn2xxx9gnixv9z47dznkd7r6xazyvn56as7j0ypj6w";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
