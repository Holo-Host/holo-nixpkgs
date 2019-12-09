{ callPackage, fetchFromGitHub }:

let
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "happ-example";
    rev = "4ed567d213897ea81c6db194f85e9ba6afdd68b7";
    sha256 = "1frz99r64nfqcfbwj4lybji3jzjha7lwpi9zy9c8bik5v7n81ic0";
  };
in

(callPackage src {}).happ-example
