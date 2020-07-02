{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "a8bd4073081e9bbc51932076e9bdb9014004c607";
    sha256 = "0b58qparcqxsgdkl4bi67jldzhkalm6mspwsvsxrgsjjz9vckh0r";
  };

  cargoSha256 = "0nczidic0kcs4i8csfqbwc84x03yywimkfz0mmgm1sk5w113dgy3";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
