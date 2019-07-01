{ pkgs, stdenv, fetchzip, ... }:
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "envoy";
  src = fetchzip {
    url = https://github.com/samrose/envoy/archive/envoy-v0.0.1.zip;
    sha256 = "1dvbi5p3njg9sk3xx4sqdsnsz250ginyyvsnghxl25bjw73jcjx7";
  };
  unpackPhase = ":";
  
  installPhase = ''
    mkdir -p $out/bin/envoy
    cp -r $src/*  $out/bin/envoy
    #ln -s $out/envoy /var/lib/envoy
  '';
}
