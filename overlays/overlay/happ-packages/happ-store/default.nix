{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://github.com/holochain/hApp-Store/releases/download/0.2.1--alpha1/happ-store.dna.json";
    name = "happ-store.dna.json";
    sha256 = "1ilj3c2qch2vhrgr6zij8rglk7m95zb83awjk00k2w4h8k9krqc2";
  };
in

runCommand "happ-store" {} ''
  install -D ${src} $out/${src.name}
''
