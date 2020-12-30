{ stdenv, makeWrapper, python3, pkgs, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "match-service-api";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "match-service-api";
      rev = "516472826cb00ec3d9a121d4af89fad9a1e56047";
      sha256 = "1kh9ibbjwp0jsqgggf5qkvl0k4c73r7610nda09wrx4ih2gjladc";
      private = true;
    };

  checkInputs = [ pytest mongomock ];
  buildInputs = [ python3 ];

  buildCommand = ''
    makeWrapper ${python3}/bin/python3 $out/bin/${name}
  '';

#   meta.platforms = platforms.linux;
}
