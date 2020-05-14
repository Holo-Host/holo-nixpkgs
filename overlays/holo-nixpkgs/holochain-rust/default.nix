{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "v0.0.48-alpha1";
    sha256 = "1lzg1s36zycniaarc6j6mkx8bakg5l2n38qxm38wdw0cc67i4xbr";
  };

  cargoSha256 = "1kj0fyh12lckgb5p09fvh2bh522nsaad6jgm420jx8ihqvx5fn2y";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
