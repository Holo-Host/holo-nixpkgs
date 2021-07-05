# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "15f0f1d0a8623260dac8f66ae8a5a051a3e969e5";
      sha256 = "18sl51rsrycad5x7489mcgkvvvb06z407mmabhs4n6x3zd607zqy";
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

    makeWrapper ${python3}/bin/python3 $out/bin/${name}-stats \
      --add-flags $out/ops_console_stats/daily_uptime.py
  '';

  meta.platforms = platforms.linux;
}
