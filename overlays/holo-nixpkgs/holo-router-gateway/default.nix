{ callPackage, fetchFromGitHub }:

  let
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-router";
      rev = "061ffd852903c11c27908630f42fb2eba70b0755";
      sha256 = "00wb10hs8h3k0ivbnk1vixhh9mvhqlmwcxqz7xjswhghh0m8piah";
    };
  in

(callPackage src {}).holo-router-gateway
