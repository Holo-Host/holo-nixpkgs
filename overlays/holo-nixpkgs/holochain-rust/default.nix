{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "f35500b5a6f8446e3e080b305d74a01f8e5a3781";
    sha256 = "0hr70cf5h2xmkzdf204lvzfhfxsvqkslysq8w9pfsim9mkd8x5b4";
  };

  cargoSha256 = "0d7pzs3d42pph1ffm7kyq7qdhzqngvpjr60r82mh37nld3kvrhyz";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
