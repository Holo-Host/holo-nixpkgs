{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://github.com/Holo-Host/holo-hosting-app/releases/download/0.2.5-alpha1/QmbTLCyz5qEELA16vHuiWGvZK269GSeRxbWttKbz24EmyV.Holo-Hosting-App.dna.json";
    name = "holo-hosting-app.dna.json";
    sha256 = "0xnmzxvcfbl50d0r4a838l4dlcwdmr2rg1s0a73prb3knkylh3si";
  };
in

runCommand "holo-hosting-app" {} ''
  install -D ${src} $out/${src.name}
''
