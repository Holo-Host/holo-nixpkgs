{ lib, ... }:

{
  imports = [ ../. ];

  # https://github.com/NixOS/nixpkgs/issues/71955#issuecomment-546189168
  boot.enableContainers = false;

  # Needed because hardware-configuration.nix generated on 20.09 install has conflict.
  # Old HoloPorts do not have this conflict as hardware-configuration is still 19.09 version
  # and does not get updated on `nixos-rebuild switch`
  hardware.enableRedistributableFirmware = lib.mkForce false;

  services.hpos-led-manager.enable = lib.mkDefault true;
}
