{ pkgs ? import ./. {} }:

with pkgs;

mkJobsets {
  owner = "Holo-Host";
  repo = "holo-nixpkgs";
  branches = [ "develop" "master" "staging" "hydra" "hydra-19.09"];
  pullRequests = <holo-nixpkgs-pull-requests>;
}
