{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "edb8c2fea518ca6a4642297b4111084b6ad1bf2f";
    sha256 = "0cl9nj2irdcsx6bx4czn5frk0x2l6fb6ccgj3nn759k73kcwrgp3";
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
