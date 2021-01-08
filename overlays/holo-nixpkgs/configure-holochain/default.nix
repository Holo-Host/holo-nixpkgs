{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "8ebc86c99ea6ead5d920648c29634bd90a53ec88";
    sha256 = "0hyg7z8532qjkdh1bk9kxvhs8gs73d4psgqsd9mb59llvl1696z2";
  };

  cargoSha256 = "0cmi0glnl0awacpr2y7v8i96gjgh000k0lylxccf80vfnhsvi4df";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
