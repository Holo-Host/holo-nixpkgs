final: previous:

with final;

let

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.20.1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "159g4d0fhmb4kfi7v4ndizamj6ajfmxxv57ylzkr9q8sdyjb5l8i";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "37013a19c4f2546304e2abea6951e2e06863fcbc";
    sha256 = "1i43k1wwcpmvx60db2kvbsvfihkfy2nn6iqqwcxz00gqm6pihr2q";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "33fa8304ea00284b73f454d05d61817db53e2869";
    sha256 = "0b5whd5hgh7zdgf9ppw7z4691ypw5qqim7cv1nx1hqhiyxy8cimh";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;

  inherit (callPackage holo-hosting-app {}) holo-hosting-app;

  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
}
