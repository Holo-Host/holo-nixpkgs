{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "46b2f31f408e7dd77696991634468c40478ce524";
    sha256 = "0ykqgr3zzd2wjs725cyd4lzz1z795w8cx1cgw085zhkbgcycf191";
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
