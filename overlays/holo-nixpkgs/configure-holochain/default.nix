{ pkgs, rustPlatform  }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
in

{
  configure-holochain = rustPlatform.buildRustPackage {
    name = "hpos-configure-holochain";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "hpos-configure-holochain";
      # Pin holochain to ddda967 (#36)
      # https://github.com/Holo-Host/hpos-configure-holochain/commit/f27d9d3ecd5078e89e5777f121f05e64f9ee2a5b
      rev = "f27d9d3ecd5078e89e5777f121f05e64f9ee2a5b";
      sha256 = "1ws6xj2dfzjw9hwppqryy1s8gkyspsbl849f0a8hag8ihh4jnfhq";
    };

    cargoSha256 = "078dpwnym72hyhl84631s4xhr42rw6lihkx6prmkkyyxvkrrcczx";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}