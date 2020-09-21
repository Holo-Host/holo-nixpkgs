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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha7/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "18v3iqcq9zxwj72xi0ndliy405mkj354nsjrdmm7q6lchbh4gzs5";
  };

  hosted-holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha7/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "18v3iqcq9zxwj72xi0ndliy405mkj354nsjrdmm7q6lchbh4gzs5";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "703cb63c5207ea094d3441b47c20d77f49bca4ce";
    sha256 = "0nvp9gl59n6l4r16i0a315vbyjf446izcjcc9ahrdcyq8adr3kay";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;
  inherit (callPackage holo-hosting-app {}) holo-hosting-app;
  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
  hosted-holofuel = wrapDNA hosted-holofuel;
}
