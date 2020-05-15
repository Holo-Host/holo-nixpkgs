final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "b01163fc10cbbdf79ca3e17e8d0d6c07e2b71d3f";
    sha256 = "0qp7gv38pzya4plvmfm639s38k2dcs3dxdbf2rkhqzinc7a04fp1";
  };

  holofuel = fetchurl {
    url = "https://holo-host.github.io/holofuel/releases/download/v0.20.5-alpha1/holofuel.dna.json";
    name = "holofuel.dna.json";
    sha256 = "0jqplwmqh12p14ljxirmcz00n3irgsl92i3lbgydmagrsy0lqw4k";
  };

  holo-hosting-app = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-hosting-app";
    rev = "2561bba8612c68f748aef8c313ac37ef5a01b85e";
    sha256 = "1rkiwc012l8l9mwnbj6246a204nbgbqhmhr5jf3rw83bsyrybs5i";
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
