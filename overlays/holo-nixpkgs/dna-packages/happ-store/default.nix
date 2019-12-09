{ callPackage, fetchFromGitHub }:

let
  src = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "4e27b888810b45d706b2982f7d97aa454aaf74cf";
    sha256 = "18h0x2m5vnmm1xz5k0j7rsc4il62vhq29qcl7wn1f9vmsfac2lrv";
  };
in

(callPackage src {}).happ-store
