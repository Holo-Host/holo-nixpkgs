{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://github.com/Holo-Host/holo-hosting-app/releases/download/0.3.0-alpha1/Qma4tEZUjYHtY4fQqvx3ofBRNfUQ8uPViijfALL4zyupKm.holo-hosting-app.dna.json";
    name = "holo-hosting-app.dna.json";
    sha256 = "1k86wk6ndh78xa22syjaa2ka6wc4d58rjqgzqwqi03vwqfbbyzvy";
  };
in

runCommand "holo-hosting-app" {} ''
  install -D ${src} $out/${src.name}
''
