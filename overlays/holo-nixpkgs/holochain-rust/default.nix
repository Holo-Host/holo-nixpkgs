{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium }:

rustPlatform.buildRustPackage {
  name = "holochain-rust";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "holochain-rust";
    rev = "v0.0.44-alpha3";
    sha256 = "18c6y1x7jx5brzghh9q7yfml88sah02x0cshmjzxxb0qy0n52zrl";
  };

  cargoSha256 = "1r4wb24bgjbhcg9cnlpwr0hva2f153wm2iyl7lmf89bvyx7qalic";

  nativeBuildInputs = [ perl ];

  buildInputs = stdenv.lib.optionals stdenv.isDarwin [
    CoreServices
    Security
  ];

  RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
  RUST_SODIUM_SHARED = "1";

  doCheck = false;
}
