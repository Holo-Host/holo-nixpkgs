{ config, lib, pkgs, ... }:

with pkgs;

let
  inherit (config.system.hpos) target;

  nixpkgs = import ../../nixpkgs/src;

  closure = import "${nixpkgs}/nixos" {
    configuration = {
      imports = [
        (../targets + ("/" + target))
      ];

      # boot.loader.grub.device = "nodev";

      fileSystems."/".fsType = "tmpfs";

      nixpkgs = {
        inherit (config.nixpkgs) crossSystem localSystem;
      };
    };
  };
in

{
  imports = [ ../. ];

  boot.postBootCommands = ''
    mkdir -p /mnt
  '';

  documentation.enable = false;

  environment.noXlibs = true;

  system.hpos.install.enable = true;

  services.openssh = {
    enable = true;
    permitRootLogin = "yes";
  };

  security.polkit.enable = lib.mkDefault false;

  services.mingetty.autologinUser = lib.mkForce "root";

  services.udisks2.enable = lib.mkDefault false;

  system.build.baseName = "hpos-for-${target}";

  system.extraDependencies =
    lib.optionals (stdenv.buildPlatform == stdenv.hostPlatform) [
      closure.config.system.build.toplevel
      stdenv
    ];
}
