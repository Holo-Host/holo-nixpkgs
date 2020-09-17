{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "0f9163c8f4df71cb479ad2876a029a8a9fb5111b";
    sha256 = "0k6rc087g6psv5yr0f38gsyr17k201n17f2nhyvmf73jlars53xs";
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
