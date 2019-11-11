{ stdenv, makeWrapper, python3 }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "hpos-init";

  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ python3 ];

  buildCommand = ''
    makeWrapper ${python3}/bin/python3 $out/bin/${name} \
      --add-flags ${./hpos-init.py}
  '';

  meta.platforms = platforms.linux;
}
