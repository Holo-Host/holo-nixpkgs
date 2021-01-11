# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "bdea48c1ab0e1ce439d23f3738f0ffcc5c7d3d28";
      sha256 = "1b2vzyrg6078cp8rqici0qmlhv1xp9k1d711jbpl1ak0z0l1dmcg";
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
