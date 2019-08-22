{ runCommand, fetchurl }:

let
  src = fetchurl {
    url = "https://github.com/Holo-Host/Holo-Hosting-App/releases/download/v0.2.2-alpha1/Qmah3kc2GkNoqKZiLV7enBz4kgaH1FogGJzP7ewfEFMwKQ.dna.json";
    name = "holo-hosting-app.dna.json";
    sha256 = "094x7hfj1vv0ighp25bmj6dkgrwl5hy1q3hd8rin5lmwgwybxkv1";
  };
in

runCommand "holo-hosting-app" {} ''
  install -D ${src} $out/${src.name}
''
