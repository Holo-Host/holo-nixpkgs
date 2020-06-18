{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "7702c48b85b79d79ff29103bf2e02072bfe0cc0e";
    sha256 = "01jmymsl4wvd746ds4iraksa9vv7fv7n77y2lys9kh2kn6z1720k";
  };

  cargoSha256 = "0lxwkj446bhnphspd6dfbanlbhf5rcq8xwavyhnkm0cr14zvba0y";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
