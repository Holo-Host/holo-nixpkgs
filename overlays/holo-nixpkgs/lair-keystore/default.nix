{ stdenv, rustPlatform, fetchFromGitHub, lib, darwin }:

rustPlatform.buildRustPackage {
  name = "lair-keystore";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = "be5868e6dcbe99c795a101c0e27ba6ed5edd557d";
    sha256 = "1kkrkip3sk5pmbv1qa3c69w2q38q5pmyiamklz72czwildkvsfzp";
  };

  cargoSha256 = "18cdxfzgd1j1v2ilvwpa8b6a9dh22myynqdj67bcwa1sbfvniaps";

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
  ]);

  doCheck = false;
}
