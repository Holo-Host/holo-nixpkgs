{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "41ce506a7e627bb0eb7881e95e96ed744ca87435";
    sha256 = "0ri0fzaw4gvqx7pjg1rvh0cqgcpp50jfi4gzzjc3g9ihlhmp1skl";
  };

  cargoSha256 = "15bks76p0q2swdx87g2sgb5z30sxyn1mhx44apm8h5nihii9wg4c";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
