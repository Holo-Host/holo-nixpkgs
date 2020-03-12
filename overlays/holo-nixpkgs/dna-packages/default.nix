final: previous:

with final;

let
  holofuel = fetchurl {
    url = "https://github.com/zo-el/temp/releases/download/0.0.2/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "0ha6naadwgxp6a7h8j00671m6ajmj4shr9ccw993c0syr5skqhwb";
  };
in

{
  holofuel = wrapDNA holofuel;
}
