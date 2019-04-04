{ pkgs, stdenv, fetchurl, fetchFromGitHub, recurseIntoAttrs, makeRustPlatform, runCommand, openssl }:
let
  rustOverlay = fetchurl {
    url = https://github.com/mozilla/nixpkgs-mozilla/archive/master.tar.gz;
    sha256 = "013hapfp76s87wiwyc02mzq1mbva2akqxyh37p27ngqiz0kq5f2n";
  };


  nixpkgs = import pkgs.path { overlays = [ rustOverlay ]; };
  holoRust = rec {

    channels = (nixpkgs.rustChannelOfTargets
      "nightly"
      "2019-01-24"
      [ "x86_64-unknown-linux-gnu" "wasm32-unknown-unknown" ]
     );
  };
  rustc = holoRust.channels;
  cargo = holoRust.channels;
  rust = makeRustPlatform {rustc = rustc; cargo = cargo;};

in
stdenv.mkDerivation {
  name = "holochain-conductor";

  src = fetchurl {
    url = https://github.com/holochain/holochain-rust/releases/download/v0.0.8-alpha/conductor-v0.0.8-alpha-x86_64-ubuntu-linux-gnu.tar.gz;
    sha256 = "19j4bjmv8sdpwj5innx5nqq474jc57kfsag1lacrp8d29yzyrldj";
  };
  buildInputs = [
    openssl
  ];
  installPhase = ''
    mkdir -p $out/bin
    cp holochain $out/bin
    patchelf --set-interpreter \
        ${stdenv.glibc}/lib/ld-linux-x86-64.so.2  $out/bin/holochain
    patchelf --set-rpath  ${stdenv.glibc}/lib $out/bin/holochain
    patchelf --set-rpath  ${openssl.out}/lib $out/bin/holochain
    #patchelf --add-needed ${openssl.out}/lib/libssl.so.1.0.0 $out/bin/holochain
    #patchelf --add-needed ${openssl.out}/lib/libcrypto.so.1.0.0 $out/bin/holochain
    mkdir /var/db/holochain
    touch /var/db/holochain/test
  '';
}
