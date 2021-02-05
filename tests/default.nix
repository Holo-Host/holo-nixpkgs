{ pkgs ? import ../. {} }:

with pkgs;

let
  testing = import "${pkgs.path}/nixos/lib/testing-python.nix" {
    inherit pkgs system;
  };

  callPackage = newScope (pkgs // testing);
in

{
  hpos-api-tests = callPackage ./hpos-api-tests {};
}
