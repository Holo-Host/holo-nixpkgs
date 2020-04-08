{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "420fe08c4dfac8f3281e5139e199d7626a142090";
    sha256 = "129qcz1alkn1v1k498qvhvp8g24frh2h3rlj6x7gh9j7d9hk3v8c";
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
