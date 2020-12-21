{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "b9693651d56adaa71545717d6ad7d4eb345ee47d";
    sha256 = "1kpjq6g6p9v4glyvn3bhrzrji3by6i2qawkpskzcjj57j1k86jyp";
  };

  cargoBuildFlags = [
    "--manifest-path=crates/holochain/Cargo.toml"
    "--no-default-features"
  ];

  cargoSha256 = "171ciff7jny8x3kmv5zmnzm1zrxrj7d86mi77li7hq65kz4m7ykk";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
