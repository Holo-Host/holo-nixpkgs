{ stdenv, rustPlatform, fetchFromGitHub, lib, darwin }:

let
  version = "v0.0.1-alpha.10";
in

rustPlatform.buildRustPackage {
  name = "lair-keystore";
  inherit version;

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = version;
    sha256 = "1kkrkip3sk5pmbv1qa3c69w2q38q5pmyiamklz72czwildkvsfzp";
  };

  cargoSha256 = "18cdxfzgd1j1v2ilvwpa8b6a9dh22myynqdj67bcwa1sbfvniaps";

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
  ]);

  doCheck = false;
}
