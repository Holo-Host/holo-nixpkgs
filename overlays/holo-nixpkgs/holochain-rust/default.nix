{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "c7ae7e791c7d23650027bef286e5ff30ec4cea89";
    sha256 = "0hr70cf5h2xmkzdf204lvzfhfxsvqkslysq8w9pfsim9mkd8x5b4";
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
