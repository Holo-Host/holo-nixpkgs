{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "e67919d6a5f3d855fc6a9abf33644225b42ad1eb";
    sha256 = "1dn2wb1n3mj5dipcw56d79a87xh0viyhvq38537m2q58sdaqgmfl";
  };

  cargoSha256 = "0nczidic0kcs4i8csfqbwc84x03yywimkfz0mmgm1sk5w113dgy3";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
