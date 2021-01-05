{ stdenv, fetchFromGitHub }:

with stdenv.lib;

stdenv.mkDerivation rec {
  name = "match-service-api";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "match-service-api";
      rev = "b650036939eb3353b21c382665586be84c899e2c";
      sha256 = "1q9fkkn5gncrvfr2ba2rpn9xxr69db96gdkhywrrkjh13jk8c1sy";
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
