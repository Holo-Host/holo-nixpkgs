{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "becbc8f60d39ba69c0c9df2026c40ecf28e19d5d";
    sha256 = "163s7lvp0aqvfd20vn0w1an3vlpfigh7d0c6pjkjnqhj2lq6j4lr";
  };

  cargoSha256 = "0v031r7w26605vnxjr8ck9w6nkwycda80h1ga8bvj4im0ygps6dz";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
