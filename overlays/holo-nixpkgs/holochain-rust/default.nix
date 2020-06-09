{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "cf360e946a75365a085facabf6ead606b1e3f028";
    sha256 = "0xzx8d9qznzglmq00vm2s1bccb4k2dd9yji07i944xlfxi7cbhxr";
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
