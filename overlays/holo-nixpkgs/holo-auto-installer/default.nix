{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "holo-auto-installer";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auto-installer";
    rev = "584ef7365500aa12442eb11802d73a0f8f27768a";
    sha256 = "08yqw7jq9z1vyvx8hgny7k8dl90ns4yhr6f299xzfh6py2as3yy2";
  };

  cargoSha256 = "0mnyizgyqjpnpxpqpp1x8p9gmgi303wp8n3k2nvzvcgwgznm33r6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
