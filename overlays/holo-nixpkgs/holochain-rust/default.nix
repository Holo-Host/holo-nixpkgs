{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "v0.0.51-alpha1";
    sha256 = "1glfjh04f9xb6wdmw1xqr0b8d8lc5gcwirg3fwfsgbq2dsgj4inc";
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
