{ stdenv, makeWrapper, python3, hpos-config, zerotierone, hpos-reset }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "hpos-admin-api";

  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ python3 ];

  buildCommand = ''
    makeWrapper ${python3}/bin/python3 $out/bin/${name} \
      --add-flags ${./hpos-admin-api.py} \
      --prefix PATH : ${makeBinPath [ hpos-config zerotierone hpos-reset ]}
  '';

  meta.platforms = platforms.linux;
}