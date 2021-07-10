{ stdenv, rustPlatform, fetchFromGitHub, lib, darwin, libiconv }:

let
  version = "2142312299e3662d3c5f22318525c7918fba1868";
in

rustPlatform.buildRustPackage {
  name = "lair-keystore";
  inherit version;

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = version;
    sha256 = "1qa80yswp7gf2am4g2c1xkibx9rw6r2nl5827sqaqskjyldgjyy1";
  };

  cargoSha256 = "1gl2jiabkhhkrn95snjrsnx2qjsypfhfrypv9zhfp54ghmkw9zsb";

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
    libiconv
  ]);

  doCheck = false;
}
