{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "607a158e4091230011282ca4f7650e6280f00f20";
    sha256 = "0ghrf48y8j76lql5lg7swkksvaiyygf1f34i4304ddc374993gr8";
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
