{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "3ad343145cb88e25467b6a42a6912abbeb77c06e";
    sha256 = "090xx4a15jkbxnixwyvz7b61ck4jq4sjv6ynaad79jlgjl90481c";
  };

  cargoSha256 = "0dqrjrkirx3l3vsja4yriw76ig8nb3l19f18hf6ngixqh1js4gmw";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
