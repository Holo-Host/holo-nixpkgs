{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://github.com/Holo-Host/happ-store/releases/download/0.3.0-alpha1/Qmdu8qqv1sgGyZuZibAaZMGjyL5VvDWCYTzK8dHi2Xo1LW.hApp-store.dna.json";
    name = "happ-store.dna.json";
    sha256 = "0fadd1dvghjv4v1c750qp61pc0knsy4y892fs0kv5zzpjs22zs2g";
  };
in

runCommand "happ-store" {} ''
  install -D ${src} $out/${src.name}
''
