{ config, lib, pkgs, ... }:

with pkgs;

let
  hposConfigPath = "/etc/hpos/config.json";
in

{
  imports = [ ../. ];

  documentation.enable = false;

  environment.systemPackages = [
    hpos-admin-client
    hpos-config
    hpos-holochain-client
    jq
  ];

  environment.variables.HPOS_CONFIG_PATH = hposConfigPath;

  services.hpos-admin-api.enable = true;
  services.hpos-holochain-api.enable = true;
  services.nginx = {
    enable = true;
    virtualHosts.localhost.locations = {
      "/hpos-admin-api/".proxyPass = "http://unix:/run/hpos-admin-api/hpos-admin-api.sock:/";
      "/hpos-holochain-api/".proxyPass = "http://unix:/run/hpos-holochain-api/hpos-holochain-api.sock:/";
    };
  };

  systemd.globalEnvironment.HPOS_CONFIG_PATH = hposConfigPath;

  users.users.nginx.extraGroups = [ "apis" ];

  virtualisation.memorySize = 3072;
}

 