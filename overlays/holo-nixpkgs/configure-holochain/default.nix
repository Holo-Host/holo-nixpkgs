{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "4d232773c2b63f41572e608dd177376881ee0808y";
    sha256 = "0sylcni25zjkr8gfx6fzmz1xvqvrqprl372pff1dcq5vi8s43plj";
  };

  cargoSha256 = "0zm4c7ga6sg029g8zyi5kr16xascmi4qqhsgaagi1hhq3h7wdwzn";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
