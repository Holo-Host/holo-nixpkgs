{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "bc1e9b98cc30a0dac8bf8d9a3eee5cc3c5e4e218";
    sha256 = "0991y090yq2i8q7knzn7ga4iss34qfa2rgd732vhv8pdin33qmv4";
  };

  cargoSha256 = "01bfmvfxj13vkj1zw79j212ymimk7sh2p6pm059aipzj816dmnrx";

  nativeBuildInputs = [ perl pkgconfig ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
