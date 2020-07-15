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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.3-alpha10/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "07ckcai3hbrl352j2bx5p2ikn48fpb222br8s8lm8rdz5ls9xva2";
  };

  hosted-holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.3-alpha10/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "07ckcai3hbrl352j2bx5p2ikn48fpb222br8s8lm8rdz5ls9xva2";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "cec85833a769b05c378353cc5b679f9bc479ef61";
    sha256 = "0dyn4plmkxg1q6p0ccrjr35sc26rg0p7dvifdipksggbfi0ypml0";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;
  inherit (callPackage holo-hosting-app {}) holo-hosting-app;
  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
  hosted-holofuel = wrapDNA hosted-holofuel;
}
