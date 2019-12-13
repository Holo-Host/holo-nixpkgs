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
    ../zerotier.nix
  ];

  boot.loader.grub.splashImage = ./splash.png;
  boot.loader.timeout = 1;

  documentation.enable = false;

  environment.noXlibs = true;

  environment.systemPackages = [
    (holoport-hardware-test.override { inherit target; })
    udevil
  ];

  networking.firewall.allowedTCPPorts = [ 443 ];

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

  services.devmon.enable = true;

  services.holo-auth-client.enable = true;

  services.holo-router-agent.enable = true;

  services.hp-admin-crypto-server.enable = true;

  services.hpos-admin.enable = true;

  services.mingetty.autologinUser = "root";

  services.openssh.enable = true;

  services.nginx = {
    enable = true;

    virtualHosts.default = {
      serverName = "localhost";
      enableACME = true;
      onlySSL = true;
      locations = {
        "/" = {
          alias = "${pkgs.hp-admin-ui}/";
          extraConfig = ''
            limit_req zone=zone1 burst=30;
          '';
        };

        "/api/v1/" = {
          proxyPass = "http://unix:/run/hpos-admin.sock:/";
          extraConfig = ''
            auth_request /auth/;
          '';
        };

        "/api/v1/ws/" = {
          proxyPass = "http://localhost:42233";
          proxyWebsockets = true;
        };

        "/auth/" = {
          proxyPass = "http://localhost:2884";
          extraConfig = ''
            internal;
            proxy_set_header X-Original-URI $request_uri;
          '';
        };

        "/holofuel/" = {
          alias = "${pkgs.holofuel-ui}/";
          extraConfig = ''
            limit_req zone=zone1 burst=30;
          '';
        };

        "/v1/hosting/" = {
          proxyPass = "http://127.0.0.1:4656";
          proxyWebsockets = true;
        };
      };
    };

    appendHttpConfig = ''
      limit_req_zone $binary_remote_addr zone=zone1:1m rate=2r/s;
    '';
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
