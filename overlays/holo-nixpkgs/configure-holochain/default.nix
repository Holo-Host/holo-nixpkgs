{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "6c6ae85d461ed500020173b83802788e0f96c3ae";
    sha256 = "1kddb42cxdiwrhzdws94hnylb8k21bsl58w6j96z9ahkqd9dscc6";
  };

  cargoSha256 = "0rhzvi9gx8ws5b0dmb6slb4j5a1l2m364zah3ikal0v7jk61sx0x";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
