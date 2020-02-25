{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "1481cc930c5c6fdeccb3674efbaed20d135adfeb";
    sha256 = "01gd19f2xspi07gbnvb3hjlhwrhf6yjhapikrayi4jvp2w603y6g";
  };

  cargoSha256 = "1cfk2z4pbk8dli31wpplczd8a1fy8fyhwa5rsl6yz3jzw9d2kdkk";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
