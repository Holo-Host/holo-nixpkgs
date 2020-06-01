{ lib, ... }:

{
  imports = [ ../. ];

  # https://github.com/NixOS/nixpkgs/issues/71955#issuecomment-546189168
  boot.enableContainers = false;

  # hardware.enableRedistributableFirmware = lib.mkDefault false;

  services.hpos-led-manager.enable = lib.mkDefault true;
}
