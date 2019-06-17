{ pkgs, stdenv, fetchzip, ... }:
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "envoy";
  src = fetchzip {
    url = https://github.com/samrose/envoy/archive/v0.0.18-alpha1.zip;
    sha256 = "0sh8jbw9xlkg9lr1p88bix26k6qhw0pqkl13v6yjb1bm1d2hs5az";
  };
  unpackPhase = ":";
  
  installPhase = ''
    mkdir -p $out/bin/envoy
    cp -r $src/*  $out/bin/envoy
    #ln -s $out/envoy /var/lib/envoy
  '';
}
