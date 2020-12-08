{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "cf4e72416e5afbf29b86d66a3d47ab2f9f6a65d2";
    sha256 = "14h83k5wm7z17vzj23s291kab62jmxysn9hp9wnifnbcmln3h5lh";
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
