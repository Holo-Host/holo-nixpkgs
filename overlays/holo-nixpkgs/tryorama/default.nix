{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "718c0980e5f0c08e295e5553532cb6cb10dada49";
    sha256 = "082d259hx7l303djnv67pkafmxh69v5kr2b2cnj4g4lz2a7c70by";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1kvh9bykw6x5il5xb1sl38152qvzq83ip96pim1xsz80fwbpzbkm";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
