{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "dffe1033e1ebeea8043529f3c2055c0453ac6e81";
    sha256 = "03xdy89cs0asrx3vvkq17073yf98kxjaya3c1r3a92hqir804g4n";
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
