{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "6bd822cf3378178b5600ab79d8560f04b5a5b837";
    sha256 = "1xcg30wwnicmz8yaz8vgi0x7z0ygjq3kkdpzp9743swqik4c0g6z";
  };

  cargoSha256 = "0c4fwzxnff46g8y247a6aqh805f195akn5nyp1xirsdrh3cjgalw";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
