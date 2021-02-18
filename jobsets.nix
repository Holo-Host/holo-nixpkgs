{ pkgs ? import ./. {}, lib ? pkgs.lib, config ? import <nixos-config> { inherit lib; } }:

with pkgs;

let
  hydra-dev = config.networking.hostName == "hydra-dev";
in

mkJobsets {
  owner = "Holo-Host";
  repo = "holo-nixpkgs";
  branches = if hydra-dev then [ "develop" "hydra" ] else [ "master" "staging" ];
} // lib.mkIf hydra-dev {
  pullRequests = <holo-nixpkgs-pull-requests>;
}
