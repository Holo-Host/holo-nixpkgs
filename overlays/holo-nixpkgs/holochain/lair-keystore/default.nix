{ stdenv, rustPlatform, fetchFromGitHub, lib, darwin, libiconv }:

let
  version = "v0.0.1-alpha.11";
in

rustPlatform.buildRustPackage {
  name = "lair-keystore";
  inherit version;

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = version;
    sha256 = "0n5rsmpfw24g4pcgrqqxqk8fwhyky7mm3nf39vyrpk3xyxh3addr";
  };

  cargoSha256 = "09g7p9yjz9gd203zpvd2cijxg6adciydr521c4zbfl47zm1x43f6";

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
    libiconv
  ]);

  doCheck = false;
}
