{ pkgs ? import ../. {} }:

with pkgs;

let
  testing = import "${pkgs.path}/nixos/lib/testing.nix" {
    inherit pkgs system;
  };

  callPackage = newScope (pkgs // testing);
in

{
  hpos-admin = callPackage ./hpos-admin {};
  holochain-conductor = callPackage ./holochain-conductor {};
}
