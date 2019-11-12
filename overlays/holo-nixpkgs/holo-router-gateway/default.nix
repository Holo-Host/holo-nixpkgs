{ callPackage, fetchFromGitHub }:

  let
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-router";
      rev = "24e41c5c51c22fa61abba35c456ea781f4aba7de";
      sha256 = "08vzl580r75bzsw43g273k72i09facg843c6ar9ncx26dmj9d95w";
    };
  in

(callPackage src {}).holo-router-gateway
