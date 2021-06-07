# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "a5e0e4327cef89e307d98dce1a8dda977707a90c";
      sha256 = "1yql972rdfspc1a3nisq1wzsnl3xwpv99bn7fmppnx950mrfmln1";
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
      --add-flags $out/collector/tranch_script.py
    
    makeWrapper ${python3}/bin/python3 $out/bin/${name}-updater \
      --add-flags $out/updater/upload_script.py
  '';

  meta.platforms = platforms.linux;
}
