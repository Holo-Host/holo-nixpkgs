{ pkgs ? import ../. {} }:

with pkgs;

let
  testing = import "${pkgs.path}/nixos/lib/testing-python.nix" {
    inherit pkgs system;
  };

  callPackage = newScope (pkgs // testing);
in

{
  # TODO: fix/port/review these
  # holochain = callPackage ./holochain {};
  hpos-admin-api = callPackage ./hpos-admin-api {};
  hpos-holochain-api = callPackage ./hpos-holochain-api {};
}
