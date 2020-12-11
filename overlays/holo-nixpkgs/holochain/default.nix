{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "6a3cb58f4a3cb6974ffac444dc1b3c45e5b039aa";
    sha256 = "0irnvbsf1hhsi0gzd82c9savv14zq9zz7pacwsprnl6vyxwc09g0";
  };

  cargoSha256 = "15bks76p0q2swdx87g2sgb5z30sxyn1mhx44apm8h5nihii9wg4c";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
