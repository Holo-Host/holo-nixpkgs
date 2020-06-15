{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "b6a451071c1352f01d219dc1dec218ba294df2c4";
    sha256 = "18cgbnl8c21pppw5snxkcgbk9vcb9bdifd5g40wd0q329ra4wccn";
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
