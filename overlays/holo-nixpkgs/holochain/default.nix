{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "43b0f45bd2784f8b993085cbae714c8537c2e082";
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
