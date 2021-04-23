{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "0ba62e93fb2796a4f9456d4eee2d62f0675238fb";
    sha256 = "sha256:1pg75xp58gflrki08ad2xa50pak3nx4p5h9ad5n4r0a0xbxw4cw3";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1kvh9bykw6x5il5xb1sl38152qvzq83ip96pim1xsz80fwbpzbkm";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
