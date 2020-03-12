{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "dc99b2381843b634b8194c214f03670117eb55c4";
    sha256 = "0p0bnfmm3wd838xp8pa84ifqk7ls3v6vfnh130whlrc2ybybw4fd";
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
