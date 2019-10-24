{ callPackage, fetchFromGitHub }:

  let
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-router";
      rev = "4983868aa49ce9da0eb3b1242ee2d8fbeae78e0a";
      sha256 = "0xnm8fpdd1gw5dhah5i686g1y6lksz9hqzvc6ji5595jbqldlw3n";
    };
  in

(callPackage src {}).holo-router-gateway
