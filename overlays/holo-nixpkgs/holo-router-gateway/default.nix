{ callPackage, fetchFromGitHub }:

  let
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-router";
      rev = "8f37dc05a316f4b3f539c6ab842c253858662440";
      sha256 = "1p3rk87mpxm661zkamq3pbrc3gaacs7l6v199d46p5ivpiawykax";
    };
  in

(callPackage src {}).holo-router-gateway
