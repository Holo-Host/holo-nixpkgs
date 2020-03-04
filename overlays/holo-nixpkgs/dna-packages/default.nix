final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "3c13dd7015f58f5246dc066582179f64d510a243";
    sha256 = "0m4d6bcg5cdiqriqj4xmfjv389kimfj02292iibm3zpbq1n7hfls";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.14.4-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1bzrmw3v0kf6q76s6h56cyxv5axjcjd0axpkbkp07y7cdd8s356r";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "389c510181fbb4e93fb8c11d2c6ce5e30602136a";
    sha256 = "0ana7v380k010np7h029fyxmfkk5k30b50ka3g0zda3z56582ziz";
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
