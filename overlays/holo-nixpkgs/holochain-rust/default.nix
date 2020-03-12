{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "40328988a3589343cc010acfec14b943e057e61b";
    sha256 = "1zgk9j0h58ikk9bqaf5v9pmpds83j3gn4ylxciw3izgdgabpj5j7";
  };

  cargoSha256 = "1h4ckbsvz9wggxq3rlx4vs92zrzkmij6mn05bgzxqxj576kyw7sp";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
