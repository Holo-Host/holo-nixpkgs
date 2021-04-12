{ lib, pkgs, ... }:

{
  imports = [
    ../.
  ];

  nix.binaryCaches = lib.mkForce [
    "https://cache.nixos.org/"
  ];

  nix.gc = {
    automatic = true;
    dates = "hourly";
    options = ''--max-freed "$((15 * 1024**3 - 1024 * $(df -P -k /nix/store | tail -n 1 | ${pkgs.gawk}/bin/awk '{ print $4 }')))"'';
  };

  programs.ssh.extraConfig = ''
    StrictHostKeyChecking accept-new
  '';

  system.defaultChannel = "https://hydra.holo.host/channel/custom/holo-nixpkgs/hydra/holo-nixpkgs";

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    dates = "*:0/10";
  };
}
