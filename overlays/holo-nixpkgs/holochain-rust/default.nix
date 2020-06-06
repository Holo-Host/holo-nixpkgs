{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "37be0762a62af6d7897877aa5c7dc4afd7648fcc";
    sha256 = "0dj42scbai6fq0dhh2gj32426nack40vq25cnfkrnfyfr77jip13";
  };

  cargoSha256 = "0lxwkj446bhnphspd6dfbanlbhf5rcq8xwavyhnkm0cr14zvba0y";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
