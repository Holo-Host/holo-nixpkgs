final: previous:

with final;

let
  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.17.0-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "13zy598afr6npwbfyzxvdgrzwwjaldma6nnk3nzdlxxjdmrqmfyi";
  };
in

{
  holofuel = wrapDNA holofuel;
}
