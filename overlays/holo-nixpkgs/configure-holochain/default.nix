{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "d24a2da6a0246ad9b2e5ecd076ecdcfa35d93bed";
    sha256 = "148zadicvsv490v9xmsgpwnly4v8m16323mc34sdhly5whs04w08";
  };

  cargoSha256 = "1543l7xw6rrk8y4dwkvmmarrn94a813bav20m5i2lj9jn2qkl3qs";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
