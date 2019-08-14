{ config, lib, pkgs, ... }:

with pkgs;

let
  inherit (config.system.holoportos) target;

  rev = gitRevision (toString ../..);

  nixpkgs = import ../../vendor/nixpkgs;

  closure = import "${nixpkgs}/nixos" {
    configuration = {
      imports = [
        (../targets + ("/" + target))
      ];

      boot.loader.grub.device = "nodev";

      fileSystems."/".fsType = "tmpfs";

      nixpkgs = {
        inherit (config.nixpkgs) crossSystem localSystem;
      };
    };
  };
in

{
  imports = [ "${nixpkgs}/nixos/modules/installer/cd-dvd/channel.nix" ../. ];

  boot.postBootCommands = ''
    mkdir -p /mnt
  '';

  documentation.enable = false;

  environment.noXlibs = true;

  system.holoportos.install.enable = true;

  services.openssh = {
    enable = true;
    permitRootLogin = "yes";
  };

  security.polkit.enable = lib.mkDefault false;

  services.mingetty.autologinUser = lib.mkForce "root";

  services.udisks2.enable = lib.mkDefault false;

  system.build.baseName = "holoportos-for-${target}-${rev}";

  system.extraDependencies =
    lib.optionals (stdenv.buildPlatform == stdenv.hostPlatform) [
      closure.config.system.build.toplevel
      stdenv
    ];
}
