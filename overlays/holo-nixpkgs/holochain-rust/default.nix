{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "v0.0.52-alpha1";
    sha256 = "13hif4hs55d4rbnrldv784ad2ji41j1x7217gs4vnpxgp0k79x96";
  };

  cargoSha256 = "1mgc4bg5cf1c7ylq7dqxs3djbb9nfsplszqldxijnvxv0bhghmsi";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
