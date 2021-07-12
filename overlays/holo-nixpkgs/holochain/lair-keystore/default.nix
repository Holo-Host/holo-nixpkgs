{ stdenv, rustPlatform, fetchFromGitHub, lib, darwin, pkgconfig, xcbuild, libiconv }:

let
  version = "45cc6c1392beb5244d6f1d4ebc58e68e9ddfd1e8";
in

rustPlatform.buildRustPackage {
  name = "lair-keystore";
  inherit version;

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = version;
    sha256 = "1rplli16l2dl2h5pa9lgzs1xbi2hcff33dxvq8b7mrkcvwr49fzs";
  };

  cargoSha256 = "19kgz81klkf1grw80h11qsixk1jfcg0w61l7wnm9x7qj3pd3wrn4";

  nativeBuildInputs = [ pkgconfig ] ++ stdenv.lib.optionals stdenv.isDarwin [
    xcbuild
  ];

  buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
    libiconv
  ]);

  doCheck = false;
}
