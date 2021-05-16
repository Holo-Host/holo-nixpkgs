{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "holo-auto-pilot";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-auto-pilot";
    rev = "584ef7365500aa12442eb11802d73a0f8f27768a";
    sha256 = "08yqw7jq9z1vyvx8hgny7k8dl90ns4yhr6f299xzfh6py2as3yy2";
  };

  cargoSha256 = "0s2fzy9903z3s107asv8jkkw020l7k5vkc9kv86fv8jg76zdllas";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
