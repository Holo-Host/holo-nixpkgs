{ config, pkgs, ... }:

let
  nixpkgs = import ../../../nixpkgs/source.nix;
in

{
  imports = [
    "${nixpkgs}/nixos/modules/virtualisation/virtualbox-image.nix"
  ];

  system.holoportos.target = "virtualbox";

  virtualbox.memorySize = 3072;

  virtualbox.vmFileName =
    "holoportos-for-${config.system.holoportos.target}.ova";

  virtualisation.virtualbox.guest.x11 = false;
}
