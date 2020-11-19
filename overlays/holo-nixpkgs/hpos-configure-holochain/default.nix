{ pkgs, rustPlatform }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    # Pin holochain to ddda967 (#36)
    # https://github.com/Holo-Host/hpos-configure-holochain/pull/36
    rev = "ac1166f8861d33f2673386ca64a26282ddeebe88";
    sha256 = "0xwbq75jjcwzlq8mv3zifbndzi9irdabaclnz8wyk0l4aahbng9p";
  };

  cargoSha256 = "078dpwnym72hyhl84631s4xhr42rw6lihkx6prmkkyyxvkrrcczx";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
