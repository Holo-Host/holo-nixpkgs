{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://github.com/Holo-Host/happ-store/releases/download/0.2.3-alpha1/hApp-store.dna.json";
    name = "happ-store.dna.json";
    sha256 = "0gl0md1qzsii1f0595mw61qv7pmlqiq1zn0y7893cmj2mjc084p9";
  };
in

runCommand "happ-store" {} ''
  install -D ${src} $out/${src.name}
''
