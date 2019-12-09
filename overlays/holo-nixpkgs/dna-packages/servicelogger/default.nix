{ callPackage, fetchFromGitHub }:

let
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "5b96b9e507a6000b99f2e2473722e94412901990";
    sha256 = "1if37bwlv32zdqxs0s6zb7bnymw4x6594aj694bhilbkkadg2wxj";
  };
in

(callPackage src {}).servicelogger.overrideAttrs (super: {
  doCheck = false;
})
