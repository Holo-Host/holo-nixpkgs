{ config, lib, pkgs, ... }:

with pkgs;

let 
  matchServiceApiSocket = "unix:/run/match-service-api.sock";

  matchServerCredentialsDir = "/var/lib/match-server-credentials";
in

{
  imports = [
    ../.
  ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.kv-uploader = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.zt-collector = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.match-service-api = {
    enable = true;
    socket = matchServiceApiSocket;
    credentialsDir = matchServerCredentialsDir;
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
}
