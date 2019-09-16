{ lib, ... }:

{
  imports = [ ../. ];

  boot.loader.grub = {
    enable = lib.mkDefault true;
    devices = [ "/dev/sda" "/dev/sdb" ];
  };

  system.holoportos.led-daemon = {
    device = "/dev/ttyUSB0";
    operstate = "/sys/class/net/enp1s0/operstate";
  };

  system.holoportos.target = "holoport-plus";
}
