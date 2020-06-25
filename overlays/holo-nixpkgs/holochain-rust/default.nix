{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "c0f8335740173b4118ea81b3e9c62e9315b7f3db";
    sha256 = "0swwa3k203x41bh67vixkwmpf3qkgnrpynz9ngnsxiq6nh1xz925";
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
