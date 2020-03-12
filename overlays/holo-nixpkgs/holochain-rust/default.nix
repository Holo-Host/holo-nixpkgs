{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "63b16329998f014f1984d0c72ea7765973710ba8";
    sha256 = "0znd0mr8pb28fxw1mr1ll5kvxlhnzjy5355xrsn9b78rcf2q5gzq";
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
