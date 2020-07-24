{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "6d8a267702335dc782cef0c76957208dfb484fb4";
    sha256 = "15y6dgla2d07zn19czcj54xwfa80kmdspk3wpfyi3zwjrkwpy0xn";
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
