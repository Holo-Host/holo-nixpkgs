{ config, lib, pkgs, ... }:

with pkgs;

let 
  matchServiceApiSocket = "unix:/run/match-service-api.sock";
in

{
  imports = [
    ../.
  ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];
  networking.firewall.allowPing = true;
  networking.resolvconf.useLocalResolver = true;

  services.kv-uploader = {
    enable = true;
  };

  services.zt-collector = {
    enable = true;
  };

  services.match-service-api = {
    enable = true;
    socket = matchServiceApiSocket;
  };

  services.nginx = {
    enable = true;

    virtualHosts.publicApi = {
      enableACME = true;
      locations = {
        "/".proxyPass = matchServiceApiSocket;
      };
      serverName = "network-statistics.holo.host";
    };
  };

  security.acme = {
    acceptTerms = true;
    # REVIEW: maybe a dedicated email for Hydra?
    email = "oleksii.filonenko@holo.host";
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    dates = "*:0/10";
  };

  boot.loader.grub.enable = lib.mkDefault true;
  boot.loader.grub.device = "/dev/inferred-grub";
  
  fileSystems."/" = { device = "$rootfsdev"; fsType = "ext4"; };
}
