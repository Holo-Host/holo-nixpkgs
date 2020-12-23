{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "5daac31fe21f5d10c192bbe208f0b11f8ee67d88";
    sha256 = "1zv063ivgwajr0sidaccr4igy67ll87xnadnm3df6glcmqgy1b3h";
  };

  cargoBuildFlags = [
    "--manifest-path=crates/holochain/Cargo.toml"
    "--no-default-features"
  ];

  cargoSha256 = "0w0cn23y858q8jqq77nx5ax51hqan3n43rzzb4146k2f0430rjx6";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
