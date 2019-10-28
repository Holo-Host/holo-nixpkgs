{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.11.1-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "06nw1symvif5w0y27p0i7q1aa39jp1s1717c9xdsww62na4n21s8";
  };
in

runCommand "holofuel" {} ''
  install -D ${src} $out/${src.name}
''
