{ lib, ... }:

{
  imports = [
    ../.
    ../inferred-grub.nix
  ];

  boot.loader.grub.enable = lib.mkDefault true;

  services.automount.enable = true;

  services.hpos-led-manager.devicePath = "/dev/ttyUSB0";

  system.hpos.target = "holoport";
}
