final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "3d45c26cedd48192e6dfe14d92d812c8dcc41ca5";
    sha256 = "1x5q074j4hj84r0nkvg85ssk8f1h2y34j112w1j9crrnmf90c9g5";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.20.6-alpha2/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "11papkyz172zqhyhqn4nvwcy6z7rml56j05s3j4f940v9p7ja23w";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "1534045fd03d197e5237a8f80740bb3a464d6334";
    sha256 = "1wc1ydvbxy6i774fz3d7rm2bxwi5f54wlynh91jsm55b8jkwrxgq";
  };

  servicelogger = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "c9b84f6131927585e724452085bcb5f2eb13f76b";
    sha256 = "0rq2dd58zmsx0zb3gwp9k9r04ll78a8s1d5nmd1h1rqxgcgg2xps";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;

  inherit (callPackage holo-hosting-app {}) holo-hosting-app;

  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
}
