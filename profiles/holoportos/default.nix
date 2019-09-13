{ config, lib, pkgs, ... }:

with pkgs;

let
  inherit (config.system.holoportos) target;
in

{
  imports = [
    ../.
    ../self-aware.nix
  ];

  boot.loader.grub.splashImage = ./splash.png;
  boot.loader.timeout = 1;

  documentation.enable = false;

  environment.noXlibs = true;

  environment.systemPackages = [
    (holoport-hardware-test.override { inherit target; })
    hello

  networking.hostName = lib.mkOverride 1100 "holoportos";

  nix.binaryCaches = [
    "https://cache.holo.host"
    "https://cache.nixos.org"
  ];

  nix.binaryCachePublicKeys = [
    "cache.holo.host-1:lNXIXtJgS9Iuw4Cu6X0HINLu9sTfcjEntnrgwMQIMcE="
  ];

  nix.gc = {
    automatic = true;
    dates = "daily";
    options = "--delete-older-than 7d";
  };

  security.sudo.wheelNeedsPassword = false;

  services.avahi = {
    enable = true;

    publish = {
      enable = true;
      addresses = true;
    };
  };

  services.mingetty.autologinUser = "root";

  services.openssh.enable = true;

  services.zerotierone = {
    enable = true;
    joinNetworks = {
      dev = [ "8286ac0e47fdb6b5" ];
      live = [];
      test = [ "93afae5963c547f1" ];
    }."${config.system.holoportos.network}";
  };

  system.holoportos.autoUpgrade = {
    enable = true;
    dates = "*:0/10";
  };

  system.stateVersion = "19.09";

  users.mutableUsers = false;

  users.users.holo.isNormalUser = true;

  users.users.root.hashedPassword = "*";
}
