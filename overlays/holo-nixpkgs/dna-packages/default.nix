final: previous:

with final;

let
  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.16.0-alpha2/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1pwz9wd0wwg4dj361b3mvmpwp74bgq29z7c5913na8iy87i2mn6s";
  };
in

{
  holofuel = wrapDNA holofuel;
}
