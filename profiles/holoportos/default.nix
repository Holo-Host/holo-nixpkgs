{ config, lib, pkgs, ... }:

with pkgs;

let
  inherit (config.system.holoportos) target;
in

{
  imports = [
    ../.
    ../binary-cache.nix
    ../self-aware.nix
  ];

  boot.loader.grub.splashImage = ./splash.png;
  boot.loader.timeout = 1;

  documentation.enable = false;

  environment.noXlibs = true;

  environment.systemPackages = [
    (holoport-hardware-test.override { inherit target; })
  ];

  networking.hostName = lib.mkOverride 1100 "holoportos";

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

  services.nginx = {
    enable = true;
    virtualHosts.default = {
      enableACME = true;
      onlySSL = true;
      locations."/".root = pkgs.singletonDir "${./index.html}";
      serverName = "nonexistent.holohost.net";
    };
  };

  services.zerotierone = {
    enable = true;
    joinNetworks = [ "93afae5963c547f1" ];
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
