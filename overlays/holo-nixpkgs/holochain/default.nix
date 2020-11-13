{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "73912006984886f2ad1f8c46949fca18d3af824e";
    sha256 = "03fbz0kp38hg533z83hwg04qlz8lnff4yglr4b2jrc9viwcnhbxa";
  };

  cargoSha256 = "0sl74hhgibadg99vrldp6wav3y59yb4kg6vb4i66mczpdnr120kp";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
