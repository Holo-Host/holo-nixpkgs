{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "041ad6c2fd88c06eace450074621be2bace0eb05";
    sha256 = "1fk530gpciyvbx5skk7a0p3iddr5b3mi2dysdap0c75fbn218hg8";
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
