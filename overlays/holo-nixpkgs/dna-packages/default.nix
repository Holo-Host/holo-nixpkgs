final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "a7feb1f701753da2b0b3c1de9d6bc1c13896782b";
    sha256 = "17d94cwk4xgf6i2xx50bxyk1bq68dc1ps4hi9wjy7f1c2qclgfdy";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.19.0-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "14ibvhg36iq93472p8cj41wjs3yy2pp7pima8mq383ww3mfyzm6n";
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
