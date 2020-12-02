{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "feb6efd6ff25414a0bc5ab9ab8288d4cf188e8bb";
    sha256 = "067r3p16jlrg7hwlm8jq7is50hmc7ylnl2wyxmws274yzls4g1sg";
  };

  cargoSha256 = "1dp6gccpshz6h8q0r439gkxzh96s1y2s7aykadfzzjwlaahdm1kv";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
