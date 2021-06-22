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

  cargoSha256 = "1wrr2v7mx7d2m247mbvrmhz344kz6bfc01pqa138a0pi1mja0fzk";

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
    libiconv
  ]);

  doCheck = false;
}
