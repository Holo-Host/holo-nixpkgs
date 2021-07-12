{ pkgs }:

with pkgs;

let
  inherit (rust.packages.stable) rustPlatform;
  inherit (darwin.apple_sdk.frameworks) Security;
in

{
  hp-admin-crypto = rustPlatform.buildRustPackage {
    name = "hp-admin-crypto";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "hp-admin-crypto";
      rev = "db676b4452050c8e3c07e538c995f22f6d00fb17";
      sha256 = "0y5s01sn4nyxn69rk3vag2p1d3cn6rcgb70bzcwdgxvgi1xi9xsa";
    };
    
    cargoSha256 = "0vl39yj70f6fc84yih3m494ypcbjzd1i1pd9fy7sqlalf6r5siy9";

    nativeBuildInputs = [ perl pkgconfig ] ++ stdenv.lib.optionals stdenv.isDarwin [
      xcbuild
    ];

    buildInputs = lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
      AppKit
      Security
      libiconv
    ]);
    
  };
}