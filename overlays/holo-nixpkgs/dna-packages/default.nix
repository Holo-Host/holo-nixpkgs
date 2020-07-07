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
    url = "https://holo-host.github.io/holofuel/releases/download/v0.21.3-alpha6/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "01z7bwqhr4jmngl2cxxpl05cs2kis3q1b2bwaxlqbry3bvvclvq2";
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
    rev = "e0ffd92e06dfd44c48a9d9c8ab1cef49977c72aa";
    sha256 = "1z7zls4czpmwxg5d9vbp0pyzh79fc7s388s968zmdn23l6iqz7wc";
  };
in

{
  inherit (callPackage happ-store {}) happ-store;

  inherit (callPackage holo-hosting-app {}) holo-hosting-app;

  inherit (callPackage servicelogger {}) servicelogger;

  holofuel = wrapDNA holofuel;
}
