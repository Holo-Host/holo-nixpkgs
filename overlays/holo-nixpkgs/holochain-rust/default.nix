{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "1ecb4540a42deb6fc54c19f1ba5b801a7310773f";
    sha256 = "0cl9ggns3yykvd4jz62qr63y5890bm269ckx1bmv7hy0ifv5kjbq";
  };

  cargoSha256 = "0v331h3p22835y1nmzi9c9gskq2k0g3qk7rirfp63zmvxzl4m7sv";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
