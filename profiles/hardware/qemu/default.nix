{ config, pkgs, ... }:

let
  nixpkgs = import ../../../nixpkgs/source.nix;
in

{
  imports = [
    "${nixpkgs}/nixos/modules/virtualisation/qemu-vm.nix"
  ];

  environment.loginShellInit = ''
    alias exit='poweroff'
  '';

  programs.bash.shellInit = ''
    source <( ${pkgs.xterm}/bin/resize )
  '';

  virtualisation = {
    diskSize = 3072;
    graphics = false;
    memorySize = 2048;
    useBootLoader = false;
  };
}
