{ stdenv, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "match-service-api";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "match-service-api";
      rev = "419493761e6ff6a8edcc7e7baf381ce3dfc96236";
      sha256 = "118sn29xavqpvk620h5jg2mfxgzal5nfq6m8gl7rzsh8ng8fwhxq";
      private = true;
    };

  checkInputs = [ pytest mongomock ];

  buildPhase = ":";

  installPhase = ''
    mkdir $out
    mv * $out
  '';

  meta.platforms = platforms.linux;
}
