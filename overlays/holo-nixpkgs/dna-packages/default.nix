final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "f9c5bb938376780b7e41d3234ff21baa6e04fb59";
    sha256 = "174nhbbxcajdz8z27fhgs7r1py2ap69i8mkam2bn4pvh4skgabl4";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.14.4-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1bzrmw3v0kf6q76s6h56cyxv5axjcjd0axpkbkp07y7cdd8s356r";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "30b329c1ee0e4354c8ef05b8651144f01797cc17";
    sha256 = "187w7b1gj52iypf283n10cbnd9731r0xy3bq2v8qfhdrrwp6gnb3";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "a464f862e757c40b8d4eadc48a7afa95c6092691";
    sha256 = "0a2sq04jrwndpjn4fccjz4hwajfskx9jbhy974hxnm9klz01sc5r";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;

  inherit (callPackage holo-hosting-app {}) holo-hosting-app;

  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
}
