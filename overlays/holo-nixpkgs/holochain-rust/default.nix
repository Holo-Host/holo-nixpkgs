{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "v0.0.46-alpha1";
    sha256 = "00pw5gn0pwxl67nmj8r0q1s3zbhilis2hvrxvrgachkjmb1a5bj1";
  };

  cargoSha256 = "0d7pzs3d42pph1ffm7kyq7qdhzqngvpjr60r82mh37nld3kvrhyz";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
