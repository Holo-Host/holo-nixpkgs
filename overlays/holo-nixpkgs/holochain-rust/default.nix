{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "3b6486a0bfd5ae03849335c883d3a2887cfe2b3f";
    sha256 = "11960cfryzi5hahxcric134yniibpynz73x63vnvn2w3ji6n6yls";
  };

  cargoSha256 = "032wfgs8w7y3hglf4qs7hggbm139a96a8zchj2lldb80ksikvmpd";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
