{ pkgs, stdenv, fetchurl, openssl }:

stdenv.mkDerivation {
  name = "holochain-cli";

  src = fetchurl {
    url = https://github.com/holochain/holochain-rust/releases/download/0.0.24-alpha2/cli-0.0.24-alpha2-x86_64-unknown-linux-gnu.tar.gz;
    sha256 = "0g2fsbc8gjjr1rrd67rvhij1040b9yf9hs2y0847vw0rihmmv5qp";
  };

  installPhase = ''
    mkdir -p $out/bin
    cp hc $out/bin
    patchelf --set-interpreter \
        ${stdenv.glibc}/lib/ld-linux-x86-64.so.2  $out/bin/hc
    patchelf --set-rpath  ${stdenv.glibc}/lib $out/bin/hc
    patchelf --set-rpath  ${openssl.out}/lib $out/bin/hc
  '';
}
