{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "4e11964df24581c0b543c594abdb3d5dcb663034";
    sha256 = "04q3nqwmsim7bp022gwh5519w4rk98jdbwyhmfb74k5gyhhg2852";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1kvh9bykw6x5il5xb1sl38152qvzq83ip96pim1xsz80fwbpzbkm";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
