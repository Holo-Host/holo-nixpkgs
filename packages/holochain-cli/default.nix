{ pkgs, stdenv, fetchurl, openssl }:

stdenv.mkDerivation {
  name = "holochain-cli";

  src = fetchurl {
    url = https://github.com/holochain/holochain-rust/releases/download/v0.0.18-alpha1/cli-v0.0.18-alpha1-x86_64-generic-linux-gnu.tar.gz;
    sha256 = "1imwbns45d4k3j4ra7swbd74zhh4kqjq4i8y8qmkl63rflcvpkia";
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
