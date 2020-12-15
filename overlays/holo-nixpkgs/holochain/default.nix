{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "5533eb485fb818f796f5af0c74087638ec5b63a8";
    sha256 = "0yi8jay8gvh7d3dapy1lihgw7692g3bwl83bwj9y3k4ky4h53prd";
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
