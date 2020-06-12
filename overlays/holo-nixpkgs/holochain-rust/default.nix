{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "0e3f81a2542f950e7590a47d173e46ec51cec515";
    sha256 = "050gb8kw7h3qimgj0w8nyb3yapgxc7s3lh2dg4k5fgkrfc30fa45";
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
