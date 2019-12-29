{ pkgs, ... }:

let
  nixpkgs = import ../../../../../nixpkgs/src;

  channel = pkgs.releaseTools.channel {
    name = "holo-nixpkgs";
    src = pkgs.holo-nixpkgs.path;
  };
in

{
  imports = [
    ../.
    "${nixpkgs}/nixos/modules/virtualisation/qemu-vm.nix"
  ];

  system.defaultChannel = "file://${channel}/tarballs/nixexprs.tar.xz";

  virtualisation = {
    diskSize = 3072;
    graphics = false;
    memorySize = 3072;
    useBootLoader = false;
  };
}
