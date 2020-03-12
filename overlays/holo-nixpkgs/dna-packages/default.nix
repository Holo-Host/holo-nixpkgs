final: previous:

with final;

let
  holofuel = fetchurl {
    url = "https://github.com/zo-el/temp/releases/download/0.0.2/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "1b46adrd7k34zi62as6a6bw0kdqyqww9h19sp57mdkqdwp1p980z";
  };
in

{
  holofuel = wrapDNA holofuel;
}
