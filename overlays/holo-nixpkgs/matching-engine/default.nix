# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "ec9372d5f27e9376964aac70b0fd9392ed393b7d";
      sha256 = "085fczakrsrpmas86qlfj4dj2rjlvwlx1x3139da1xs99ddxm9dc";
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
      --add-flags $out/collector/poll_script.py
    
    makeWrapper ${python3}/bin/python3 $out/bin/${name}-updater \
      --add-flags $out/updater/upload_script.py
  '';

  meta.platforms = platforms.linux;
}
