# TODO: See if these python scripts can be pre-compiled for quicker execution

{ stdenv, makeWrapper, python3, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "05022268f6135c3589c4e5951d85204ceef5f2c1";
      sha256 = "0dkg0pgh9nf35xwap680a4yws247jrjsn9i36w2qqdff3909bzzm";
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
