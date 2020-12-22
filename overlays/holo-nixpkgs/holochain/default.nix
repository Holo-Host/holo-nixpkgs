{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "b1a5b34e7c8f9ff2e92e3b9db71c658d57a2bbd9";
    sha256 = "02hij8rvzhkzby2miigsc6zjk4axrcmllsdbmlsz1nj7vpr1dhk9";
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
