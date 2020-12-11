{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "fc61aff28e6f3f7c416053c22a26e1a457c093b4";
    sha256 = "12hlmlmjpbzwl5k0jwv7ay58zm9kglmsp0h3n6gnvmc2syyfa0sj";
  };

  cargoSha256 = "1543l7xw6rrk8y4dwkvmmarrn94a813bav20m5i2lj9jn2qkl3qs";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
