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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha8/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1bpa1lclmn15lg91r1lkh1i48gachpidivclfbcq50m4rr15nmjg";
  };

  hosted-holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha8/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1bpa1lclmn15lg91r1lkh1i48gachpidivclfbcq50m4rr15nmjg";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "e25f3dba41c6bda71367fb06769edb962ba6fb3c";
    sha256 = "18df0v8h620fnl61fk8099jvms5sla0i0g974ld4v8ir9pj7y8a4";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;
  inherit (callPackage holo-hosting-app {}) holo-hosting-app;
  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
  hosted-holofuel = wrapDNA hosted-holofuel;
}
