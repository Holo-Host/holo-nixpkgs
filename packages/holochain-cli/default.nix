{ pkgs, stdenv, fetchurl, openssl }:

stdenv.mkDerivation {
  name = "holochain-cli";

  src = fetchurl {
    url = https://github.com/holochain/holochain-rust/releases/download/v0.0.12-alpha1/cli-v0.0.12-alpha1-x86_64-generic-linux-gnu.tar.gz;
    sha256 = "15frnjn3q4mfsg53dy59mwnkhzwkf6iwm0d5jix2d575i8cyn5xi";
  };
  #buildInputs = [
  #  openssl
  #];
  installPhase = ''
    mkdir -p $out/bin
    cp hc $out/bin
    patchelf --set-interpreter \
        ${stdenv.glibc}/lib/ld-linux-x86-64.so.2  $out/bin/hc
    patchelf --set-rpath  ${stdenv.glibc}/lib $out/bin/hc
    patchelf --set-rpath  ${openssl.out}/lib $out/bin/hc
    #patchelf --add-needed ${openssl.out}/lib/libssl.so.1.0.0 $out/bin/hc
    #patchelf --add-needed ${openssl.out}/lib/libcrypto.so.1.0.0 $out/bin/hc
  '';
}
