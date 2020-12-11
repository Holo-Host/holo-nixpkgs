{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "bdd2578a93f81e13d425bd3ed8a6cdc3356f8e1d";
    sha256 = "1vy1mkbm9hnxxd3j2hpfrjscxwrxj3w38m9cfigpa0vsls2l2x9k";
  };

  cargoSha256 = "0crpxmxp7fq5xq8amls89jjcj0yxn8ijk1bm2v0h97jyb3rq8j6d";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
