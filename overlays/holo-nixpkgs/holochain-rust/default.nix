{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "bc43dcf9b4c10b93d4be46e6aaafdfe5e561ae14";
    sha256 = "123gj6nmzfs3xscma09g95kf5bwz5a4gl61370x71xpwvjbzij5w";
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
