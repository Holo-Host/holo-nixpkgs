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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.4-alpha6/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "0fr21vs2bv1jiia9cx94pdf7azjyldincqpkr8m4v3qa1js56sjd";
  };

  hosted-holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.4-alpha6/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "0fr21vs2bv1jiia9cx94pdf7azjyldincqpkr8m4v3qa1js56sjd";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "780fa2fd96cd6ae0fac9d3c685fca7e18759a000";
    sha256 = "0filfgp410hbrmbhjz5h8d08m8hwb1108nc8vx2jr04nlxbr128d";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;
  inherit (callPackage holo-hosting-app {}) holo-hosting-app;
  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
  hosted-holofuel = wrapDNA hosted-holofuel;
}
