{ stdenv, makeWrapper, python3, python3Packages }:

with stdenv.lib;

stdenv.mkDerivation {
  name = "holo-whitelist";
	
  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ python3 ];

  buildCommand = ''
    makeWrapper ${python3}/bin/python3 $out/bin/holo-whitelist \
      --add-flags ${./holo-whitelist.py} 
  '';

  meta.platforms = platforms.linux;
}
