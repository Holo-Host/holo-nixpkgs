{ lib, ... }:

{
  imports = [ ../. ];

  boot.loader.grub = {
    enable = lib.mkDefault true;
    devices = [ "/dev/sdb" ];
  };

  nixpkgs.hostPlatform.system = "x86_64-linux";

  system.holoportos.led-daemon = {
    device = "/dev/ttyUSB0";
    operstate = "/sys/class/net/enp1s0/operstate";
  };

  system.holoportos.target = "holoport-plus";
}
