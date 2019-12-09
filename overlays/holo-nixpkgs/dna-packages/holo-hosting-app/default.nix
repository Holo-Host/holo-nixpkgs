{ callPackage, fetchFromGitHub }:

let
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "bbda39876d5bc206712fcbe27fdb5e405006e539";
    sha256 = "0wf7133cam8s3m6hww5fk29343z2a0xf2qv764radx5pcr02lhs0";
  };
in

(callPackage src {}).holo-hosting-app
