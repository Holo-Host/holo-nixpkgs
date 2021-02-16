{ config, pkgs, lib, ... }:

{
  imports = [
    ../.
  ];

  boot.extraModulePackages = with config.boot.kernelPackages; [
    sun50i-a64-gpadc-iio
  ];

  boot.kernelModules = [ "sun50i-a64-gpadc-iio" ];

  boot.kernelParams = [
    "console=ttyS0,115200n8"
    "console=tty0"
  ];

  boot.loader.generic-extlinux-compatible = {
    enable = true;
    dtbDir = pkgs.holoport-nano-dtb;
  };

  boot.loader.grub.enable = false;

  services.automount.enable = true;

  services.hpos-led-manager.devicePath = "/dev/ttyS2";

  system.hpos.target = "holoport-nano";

  swapDevices = [
    {
      device = "/swapfile";
      size = 1024 * 4;
    }
  ];
}
