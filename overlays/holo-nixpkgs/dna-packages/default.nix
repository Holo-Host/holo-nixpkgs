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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.20.1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "159g4d0fhmb4kfi7v4ndizamj6ajfmxxv57ylzkr9q8sdyjb5l8i";
  };


in

{
  inherit (callPackage happ-store {}) happ-store;



  holofuel = wrapDNA holofuel;
}
