final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "d775015e6a983b6d5b75a93ba9915516d65613b4";
    sha256 = "1c4iblk0bqmrj7l63aaxgc3spxk0vl7ix9w1gnp5izgwiqas22il";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.16.0-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "00262l6p5xlv1c2ypj5sjzpkc42qn883nhkwxv05hrj11af22zdh";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "80996df0ae38ba623c850d8399fc9e2412db6bb0";
    sha256 = "1w6lgi50a6sagcpyfmyw1d61kdvd569rihrmf5a105yj9kq3xg4l";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "7f14de64f760946cbe54822a8ba35ccdc8e56a5d";
    sha256 = "1l7lwg2h373lvi51vfcbin5wjfmvxl01smnb420vsh8g00mb6aq2";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;

  inherit (callPackage holo-hosting-app {}) holo-hosting-app;

  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
}
