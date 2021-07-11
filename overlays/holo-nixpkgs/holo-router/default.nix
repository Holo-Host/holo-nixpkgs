{ pkgs }:

with pkgs;

let
  inherit (rust.packages.stable) rustPlatform;
in

{
  holo-router = rustPlatform.buildRustPackage {
    name = "holo-router";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "router-registry";
      rev = "7ed6955552057fd97bf0843ee06b584c3e9f19fe";
      sha256 = "1nvkpy80ykmzgvg0cnr83sm6p7636xnbj2rfmm0qz3rb74aw91j7";
    };

    cargoSha256 = "1fagwsvz7rh22j8n13nw9zrngkg5qw1k4vzyrsyvkpzi0ljk7sp7";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}