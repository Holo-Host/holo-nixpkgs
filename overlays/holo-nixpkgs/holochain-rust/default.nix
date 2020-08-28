{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "41ff64a748d20d338bfde4c92a7f1f16ca565989";
    sha256 = "1qackk6jshh1ck1zkg9mmmhkg1miln0r46c0qnnxchhba360kq31";
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
