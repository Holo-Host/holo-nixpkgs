# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "a4dfa1beecf7992cf72fceb5e502f6a4168806fd";
      sha256 = "0zccnqzf3dcmhcf4ddk36rhap6f5cpa5qfv3spdwf10kl9l6pmzz";
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
