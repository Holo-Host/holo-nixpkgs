{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "11e4e16dfa213bdc35e21838baced8efa3dd04b1";
    sha256 = "0ms26jap4ny8v9sv5mh9i1hxj518jzrsz6da7dswaxgzad1sha0y";
  };

  cargoSha256 = "1dv83nl23bs1bnksplyfbyhjap88p4chw3m65c031kvrggcp4cdb";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
