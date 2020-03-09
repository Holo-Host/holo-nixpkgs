{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "163b3bc515201dbb0a4c42e92b61026d6691809b";
    sha256 = "0nhdbqy72qa59ab9mqvxhhyglc6fr3v1dxpnvf7ayw92jh7jr6ww";
  };

  cargoSha256 = "18lqrvc5q6wpfg7cz4f1gd9h5ljqv7g0zgkpg314y1r4inqjlphn";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
