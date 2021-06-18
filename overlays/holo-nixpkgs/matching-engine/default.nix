# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "7f3e652a2132c60f27908d8120db320a76a8a5b2";
      sha256 = "1k2yrkmvx85c4w6di9hcq7d585vdawkq7qsc2fn8gc4ncgz3jh0r";
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

    makeWrapper ${python3}/bin/python3 $out/bin/${name}-trancher \
      --add-flags $out/trancher/tranch_script.py
    
    makeWrapper ${python3}/bin/python3 $out/bin/${name}-uploader \
      --add-flags $out/uploader/upload_script.py
  '';

  meta.platforms = platforms.linux;
}
