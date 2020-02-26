{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, pcre }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "1481cc930c5c6fdeccb3674efbaed20d135adfeb";
    sha256 = "01gd19f2xspi07gbnvb3hjlhwrhf6yjhapikrayi4jvp2w603y6g";
  };

  cargoSha256 = "00fjzzvaiyawds27g4fvwsnq7gcgadam26p07zq11hz0c1dw5krd";

  nativeBuildInputs = [ perl pcre ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
