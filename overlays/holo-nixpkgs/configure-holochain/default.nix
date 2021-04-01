{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "c79756e2b694d8a2f5c10712f83598071617c520";
    sha256 = "1k1y0chfy9jlxmgs6mpgclj02li7a2p3qrf0dhbb1kldygjjqp6v";
  };

  cargoSha256 = "00wn68ap8c2igc2acwldwd02wbkglbba19zdb3wsp78259dznpad";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
