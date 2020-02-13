{ config, lib, pkgs, ... }:

with pkgs;

let
  holo-router-acme = writeShellScriptBin "holo-router-acme" ''
    base36_id=$(${hpos-config-into-base36-id}/bin/hpos-config-into-base36-id < "$HPOS_CONFIG_PATH")
    until $(${curl}/bin/curl --fail --head --insecure --max-time 10 --output /dev/null --silent "https://$base36_id.holohost.net"); do
      sleep 5
    done
    exec ${simp_le}/bin/simp_le \
      --default_root ${config.security.acme.certs.default.webroot} \
      --valid_min ${toString config.security.acme.validMin} \
      -d "$base36_id.holohost.net" \
      -f fullchain.pem \
      -f full.pem \
      -f key.pem \
      -f account_key.json \
      -f account_reg.json \
      -v
  '';

  conductorHome = "/var/lib/holochain-conductor";

  dnas = with dnaPackages; [
    happ-store
    holo-hosting-app
    holo-communities-dna
    holofuel
    servicelogger
  ];

  dnaConfig = drv: {
    id = drv.name;
    file = "${drv}/${drv.name}.dna.json";
    hash = pkgs.dnaHash drv;
  };

  instanceConfig = drv: {
    agent = "host-agent";
    dna = drv.name;
    id = drv.name;
    storage = {
      path = "${conductorHome}/${drv.name}";
      type = "file";
    };
  };
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

  environment.noXlibs = true;

  networking.firewall.allowedTCPPorts = [ 443 ];

  networking.hostName = lib.mkOverride 1100 "hpos";

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

  services.holo-auth-client.enable = lib.mkDefault true;

  services.holo-router-agent.enable = lib.mkDefault true;

  services.hp-admin-crypto-server.enable = true;

  services.hpos-admin.enable = true;

  services.hpos-init.enable = lib.mkDefault true;

  services.mingetty.autologinUser = "root";

  services.nginx = {
    enable = true;

    virtualHosts.default = {
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

  services.holochain-conductor = {
    enable = true;
    config = {
      agents = [
        {
          id = "host-agent";
          name = "Host Agent";
          keystore_file = "/tmp/holo-keystore";
          public_address = "$HOLO_KEYSTORE_HCID";
        }
      ];
      bridges = [];
      dnas = map dnaConfig dnas;
      instances = map instanceConfig dnas;
      network = {
        type = "sim2h";
        sim2h_url = "ws://public.sim2h.net:9000";
      };
      persistence_dir = conductorHome;
      signing_service_uri = "http://localhost:9676";
      interfaces = [
        {
          id = "master-interface";
          admin = true;
          driver = {
            port = 42211;
            type = "websocket";
          };
        }
        {
          id = "internal-interface";
          admin = false;
          driver = {
            port = 42222;
            type = "websocket";
          };
        }
        {
          id = "admin-interface";
          admin = false;
          driver = {
            port = 42233;
            type = "websocket";
          };
          instances = map (drv: { id = drv.name; }) dnas;
        }
        {
          id = "hosted-interface";
          admin = false;
          driver = {
            port = 42244;
            type = "websocket";
          };
        }
      ];
    };
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = lib.mkDefault true;
    dates = "*:0/10";
  };

  systemd.services.acme-default.serviceConfig.ExecStart =
    lib.mkForce "${holo-router-acme}/bin/holo-router-acme";

  system.stateVersion = "19.09";

  users.users.nginx.extraGroups = [ "hpos-admin-users" ];

  users.users.holo.isNormalUser = true;

  users.users.root.hashedPassword = "*";
}
