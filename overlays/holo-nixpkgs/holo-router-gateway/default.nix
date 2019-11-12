{ callPackage, fetchFromGitHub }:

  let
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-router";
      rev = "56cdff53b78423d083ef34e62239b1e8c5d024ce";
      sha256 = "19x034p81d0fj09vz55hd7sahgr5rcyh2vlyry2yddnk8vq2jwcr";
    };
  in

(callPackage src {}).holo-router-gateway
