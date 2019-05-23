{ pkgs, stdenv, fetchgit, cmake, ... }:

stdenv.mkDerivation rec {
  src = fetchgit {
    url = https://github.com/fluent/fluent-bit;
    sha256 = "0rmdbrhhrim80d0hwbz56d5f8rypm6h62ks3xnr0b4w987w10653";
    rev = "8cc3a1887c3fcd6dd95a4a475fb213a0e399c222";
  };
  name = "fluentbit";
  version = "1.0.6";
  buildInputs = [ cmake ];
  builder = ./builder.sh;

  meta = with stdenv.lib; {
    description = "fluentbit";
    homepage = "https://fluentbit.io";
    maintainers = [ maintainers.samrose ];
    license = licenses.asl20;
    platforms = platforms.linux;
  };


}
