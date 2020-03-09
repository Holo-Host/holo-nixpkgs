{ stdenv, rustPlatform, fetchFromGitHub, pcre, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "a56c2a7bdb6a12e6f574f6e6510634c7099282aa";
    sha256 = "1ab789hppfi2asjpdkvg2nfndcx27v8yvs1lpnvpngqvk9pnb4gg";
  };

  cargoSha256 = "16w403az65fi2dyf0g5j7w5rkmfkx318d5dwx4jgq43fgqrxfhfy";

  nativeBuildInputs = [ pcre perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
