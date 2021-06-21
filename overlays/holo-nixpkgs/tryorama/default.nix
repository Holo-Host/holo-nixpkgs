{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "ee76b900bca7b8354a193b11b6c03a59173f1b41";
    sha256 = "1w1aq0cyqh7qk5rrqsmaapxrsj0wv8z9xr10akibxgs7acxi7z81";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "0p2w4ay61p9j1jyd4j4la87nqlbcyzrr4ds3f243smxxplqkn33r";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
