{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "d982ff36de00e2fa210b6ae458b5701681337a3f";
    sha256 = "1bx2n2rck360442p5q6qvnpzgqbqkicdhi5yhi4j9jxppdxb31lh";
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
