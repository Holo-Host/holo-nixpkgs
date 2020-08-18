{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "6cf085ae35f31a52c82ac4c0fc0d442d0fd5c920";
    sha256 = "0wr5mb30aw7m1qp7p5vjrx5z9qbgz0mlgav6v1g213cw18c4jlbn";
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
