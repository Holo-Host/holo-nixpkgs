{ stdenv, rustPlatform, fetchFromGitHub, lib, darwin, libiconv }:

let
  version = "v0.0.1-alpha.12";
in

rustPlatform.buildRustPackage {
  name = "lair-keystore";
  inherit version;

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = version;
    sha256 = "05p8j1yfvwqg2amnbqaphc6cd92k65dq10v3afdj0k0kj42gd6ic";
  };

  cargoSha256 = "1x7gzndv8qax3wwv7imki9rrzm0l22qhf49bdkjjn6nb430fmlnk";

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
    libiconv
  ]);

  doCheck = false;
}
