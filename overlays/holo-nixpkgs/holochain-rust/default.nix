{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "f8a6993386741f77c26e8e3d4c054f542552cdad";
    sha256 = "19wa10q9xcpzhrfwa0a6jn6xlrdh8dw3nrhlfs22ai1y8rhk4fhd";
  };

  cargoSha256 = "1rb2fkpz2l0xdhkiim9wzr7bxl2gwm6n2j37nmr1rgpbl182mivx";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
