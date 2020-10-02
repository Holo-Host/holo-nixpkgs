final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "b19aaa63a57dc78a6a37c802358cd46e746acccc";
    sha256 = "1kqjdags3ja7pll6j88d38k3xckbdijsdhkwa87kzc15js247z2b";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "465c36aaf6692d39d4e4677a88f2900bed68f550";
    sha256 = "0k4wpp92nydzi0yxckwka01psx4hlz551z4xc9y5x9yfwk6idmk7";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha11/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1w1my6msdgp14y76kvk4r293dygyvf42av7pd90famzr73wfvakc";
  };

  hosted-holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha11/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1w1my6msdgp14y76kvk4r293dygyvf42av7pd90famzr73wfvakc";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "9b88735c3c359db4e77247f577c4fc94557c0d4e";
    sha256 = "0pw2kjrn4rqv5f82f5z3qcqp2j24m6swkkahh499fansv454ha49";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;
  inherit (callPackage holo-hosting-app {}) holo-hosting-app;
  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
  hosted-holofuel = wrapDNA hosted-holofuel;
}
