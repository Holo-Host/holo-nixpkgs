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
    rev = "e353f9f1ab857096e07134a53845b341e3d876c8";
    sha256 = "13y0ik8m0kds5vwp7aqh5iv11n3sa1kw0z781ihn9m5fggp180dh";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;
  inherit (callPackage holo-hosting-app {}) holo-hosting-app;
  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
  hosted-holofuel = wrapDNA hosted-holofuel;
}
