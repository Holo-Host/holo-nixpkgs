{ pkgs, stdenv, fetchzip, ... }:
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "envoy";
  src = fetchzip {
    url = https://github.com/samrose/envoy/archive/v0.0.18-alpha1.zip;
    sha256 = "189q6g1c5v51aaggqjhxvf3kj6r8wxrd4kv7dms21m4jjmzl7ww1";
  };
  unpackPhase = ":";
  
  installPhase = ''
    mkdir -p $out/bin/envoy
    cp -r $src/*  $out/bin/envoy
    #ln -s $out/envoy /var/lib/envoy
  '';
}
