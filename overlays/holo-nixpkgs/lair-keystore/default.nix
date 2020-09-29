{ stdenv, rustPlatform, fetchFromGitHub, perl }:

rustPlatform.buildRustPackage {
  name = "lair-keystore";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "lair";
    rev = "a9fe82543dba008126bcbb6925b177599460e131";
    sha256 = "12y9rvmy2lszxnx0y64a4l6qcbh32wxpdzfczyfl7sajx156dpwm";
  };

  cargoSha256 = "1xb6f8565gmm4g8q7xfinxz7s829j9vacfg67f3ppaa38907w48n";

  doCheck = false;
}
