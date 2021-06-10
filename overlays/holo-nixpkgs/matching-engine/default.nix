# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "3cde2104037bff13d2f69f4e6a68d89b77843da4";
      sha256 = "0gl9ir5rc8az8acxwmzkpzglkbh7zhrm2ivfhngnv332k78d0vp6";
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
