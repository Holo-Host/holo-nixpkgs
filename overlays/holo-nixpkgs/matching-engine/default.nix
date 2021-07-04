# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "169f5ef21389e896e48bce241e00bd757182dc3f";
      sha256 = "1pp6rwhc25q848nfarg7ac6s0z6nw2zikdi9ad9757lyimi0b1cz";
      private = true;
    };

  nativeBuildInputs = [ makeWrapper ];
  checkInputs = [ pytest mongomock ];
  buildInputs = [ python3 ];

  buildPhase = ":";

  installPhase = ''
    mkdir $out
    mv * $out

    makeWrapper ${python3}/bin/python3 $out/bin/${name}-collector \
      --add-flags $out/collector/collector_script.py

    makeWrapper ${python3}/bin/python3 $out/bin/${name}-trancher \
      --add-flags $out/trancher/tranch_script.py
    
    makeWrapper ${python3}/bin/python3 $out/bin/${name}-uploader \
      --add-flags $out/uploader/upload_script.py
  '';

  meta.platforms = platforms.linux;
}
