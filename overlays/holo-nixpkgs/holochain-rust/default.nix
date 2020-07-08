{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "6ffd17d369d0fc029cd85db6ef7d0303cc9684d0";
    sha256 = "15civa2wpx2wmy0j3x8a3k608qz2hkv4fhbiyi7lnzf5ypsvlw35";
  };

  cargoSha256 = "0kz2pp8ibhlc7ssw5bxs3w1dwkjmvmlrrkdrsx9qwvmvm4ylv7wd";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
