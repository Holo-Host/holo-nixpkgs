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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.16.0-alpha2/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1pwz9wd0wwg4dj361b3mvmpwp74bgq29z7c5913na8iy87i2mn6s";
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
    rev = "d4b411bc969e2c56436fb6c3ae5c2a2a62d26a17";
    sha256 = "0i5a8757sikgcsrf5ppi9lbnisi5iqxh0rphkpqrd52ibpf6nfsz";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;

  inherit (callPackage holo-hosting-app {}) holo-hosting-app;

  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
}
