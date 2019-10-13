{ stdenv, makeWrapper, python3, python3Packages }:

with stdenv.lib;

stdenv.mkDerivation {
  name = "holo-auth-client";
	
  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ python3 ];

  buildCommand = ''
    makeWrapper ${python3}/bin/python3 $out/bin/holo-auth-client \
      --add-flags ${./holo-auth-client.py} 
  '';

  meta.platforms = platforms.linux;
}
