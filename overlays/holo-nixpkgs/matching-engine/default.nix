# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "68c0d9bbf647e86b1dcd0e3b0bd008f2609a1419";
      sha256 = "0c6bi6nvc9h6wxr0zj08n4khw03f80wb91m2bfa9cnqyahr1m80s";
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
