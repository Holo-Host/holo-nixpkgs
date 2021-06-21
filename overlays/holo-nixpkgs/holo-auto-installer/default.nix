{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "holo-auto-installer";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auto-installer";
    rev = "cc996b3f1389296bf7756adbf4cd13b7152c43d0";
    sha256 = "00bx4hsy5z5kxisqk9fnl6fi5cazkpa21nx7k8kibz5f07nsa3bl";
  };

  cargoSha256 = "1kzg4zwxnkh2h9mzh0mrrhfsyg94gc5x3wcdf8f8afpcpks72jhc";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
