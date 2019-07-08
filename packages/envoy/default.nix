{ pkgs, stdenv, fetchzip, ... }:
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "envoy";
  src = fetchzip {
    url = https://github.com/samrose/envoy/archive/envoy-v0.0.1.zip;
    sha256 = "0ca21w2w2pg8kc1wymiivw4mzd2yja8v91lxv6sdi4n8kr8wc0pw";
  };
  unpackPhase = ":";
  
  installPhase = ''
    mkdir -p $out/bin/envoy
    cp -r $src/*  $out/bin/envoy
    #ln -s $out/envoy /var/lib/envoy
  '';
}
