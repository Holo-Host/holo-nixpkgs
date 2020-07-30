{ stdenv, makeWrapper, python3, hpos-config-is-valid, zerotierone, hpos-update-cli, hpos-reset }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "hpos-admin";

  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ python3 ];

  buildCommand = ''
    makeWrapper ${python3}/bin/python3 $out/bin/${name} \
      --add-flags ${./hpos-admin.py} \
      --prefix PATH : ${makeBinPath [ hpos-config-is-valid zerotierone hpos-reset hpos-update-cli ]}
  '';

  meta.platforms = platforms.linux;
}
