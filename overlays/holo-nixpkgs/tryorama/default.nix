{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "7b472f82637fd718478e5815ca532331d671886d";
    sha256 = "sha256:1bmjs4l7gzadzgpxkhx1szbjp092x3dvdyyscbmpyxnssrq0glzj";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1kvh9bykw6x5il5xb1sl38152qvzq83ip96pim1xsz80fwbpzbkm";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
