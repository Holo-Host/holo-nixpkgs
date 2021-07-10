{ config, lib, pkgs, ... }:

with pkgs;

let
  settings = import ../../global-settings.nix;

  networks = import ../../holo-networks.nix;

  holoNetwork = networks.selectNetwork config.system.holoNetwork;
in

{
  imports = [
    ../.
  ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];
  networking.firewall.allowPing = true;
  networking.resolvconf.useLocalResolver = true;

  services.dnscrypt-proxy2 = {
    enable = true;

    # https://dnscrypt.info/stamps/
    settings.static.holo-router-registry.stamp = holoNetwork.routerRegistry.stamp;
  };

  services.holo-router-gateway = {
    enable = true;
    hposDomain = holoNetwork.hposDomain;
  };

  services.nginx = {
    enable = true;
    virtualHosts.default = {
      extraConfig = ''
        return 301 https://$host$request_uri;
      '';
    };
  };

  services.zerotierone = {
    enable = lib.mkDefault true;
    joinNetworks = [ holoNetwork.zerotierNetworkID ];
  };

  boot.cleanTmpDir = true;
}
