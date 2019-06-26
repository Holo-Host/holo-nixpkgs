{ pkgs, stdenv, fetchzip, ... }:
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "envoy";
  src = fetchzip {
    url = https://github.com/samrose/envoy/archive/v0.0.18-alpha1.zip;
    sha256 = "1f3cy58zm5g7zsdgzva5h8lsk77gvffh9axvz1jda211bk4wczyb";
  };
  unpackPhase = ":";
  
  installPhase = ''
    mkdir -p $out/bin/envoy
    cp -r $src/*  $out/bin/envoy
    #ln -s $out/envoy /var/lib/envoy
  '';
}
