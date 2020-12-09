{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig }:

rustPlatform.buildRustPackage {
  name = "holochain";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain";
    rev = "8f1a47ddbf637f9dbc41deca2f09e65ab889e6b9";
    sha256 = "0x3cwpb451yxvxkvarg57dyf06zijhk5g8q9pv0af7p1fajsz168";
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
