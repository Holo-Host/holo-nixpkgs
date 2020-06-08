{ pkgs ? import ./. {} }:

with pkgs;

mkJobsets {
  owner = "Holo-Host";
  repo = "holo-nixpkgs";
  branches = [ "develop" "master" "staging" "hydra" ];
  pullRequests = <holo-nixpkgs-pull-requests>;
}
