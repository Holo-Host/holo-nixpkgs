{ config, lib, pkgs, ... }:

with pkgs;

{
  imports = [
    ../.
    ../../zerotier.nix
  ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];
  networking.firewall.allowPing = true;
  networking.resolvconf.useLocalResolver = true;

  services.dnscrypt-proxy2 = {
    enable = true;

    # https://dnscrypt.info/stamps/
    settings.static.holo-router-registry.stamp =
      "sdns://AgcAAAAAAAAADTEwNC4xNy4yNDEuNDUAGXJvdXRlci1yZWdpc3RyeS5ob2xvLmhvc3QNL3YxL2Rucy1xdWVyeQ";
  };

  services.holo-router-gateway.enable = true;

  services.nginx = {
    enable = true;
    virtualHosts.default = {
      extraConfig = ''
        return 301 https://$host$request_uri;
      '';
    };
  };

  boot.cleanTmpDir = true;
}
