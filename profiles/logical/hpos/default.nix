{ config, lib, pkgs, ... }:

with pkgs;

let
  holo-router-acme = writeShellScriptBin "holo-router-acme" ''
    base36_id=$(${hpos-config}/bin/hpos-config-into-base36-id < "$HPOS_CONFIG_PATH")
    until $(${curl}/bin/curl --fail --head --insecure --max-time 10 --output /dev/null --silent "https://$base36_id.holohost.net"); do
      sleep 5
    done
    exec ${simp_le}/bin/simp_le \
      --default_root ${config.security.acme.certs.default.webroot} \
      --valid_min ${toString (config.security.acme.validMinDays * 24 * 60 * 60)} \
      -d "$base36_id.holohost.net" \
      -f fullchain.pem \
      -f full.pem \
      -f chain.pem \
      -f cert.pem \
      -f key.pem \
      -f account_key.json \
      -f account_reg.json \
      -v
  '';

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";
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

  # REVIEW: `true` breaks gtk+ builds (cairo dependency)
  environment.noXlibs = false;

  environment.systemPackages = [ hc-state hpos-reset hpos-admin-client hpos-update-cli git ];

  networking.firewall.allowedTCPPorts = [ 443 9000 ];

  networking.hostName = lib.mkOverride 1100 "hpos";

  nix.gc = {
    automatic = true;
    dates = "daily";
    options = "--delete-older-than 7d";
  };

  security.acme = {
    acceptTerms = true;
    email = "acme@holo.host";
  };

  security.sudo.wheelNeedsPassword = false;

  services.holo-auth-client.enable = lib.mkDefault true;

  services.holo-envoy.enable = lib.mkDefault true;

  services.holo-router-agent.enable = lib.mkDefault true;

  services.hp-admin-crypto-server.enable = true;

  services.hpos-admin-api.enable = true;

  services.hpos-holochain-api.enable = true;

  services.hpos-init.enable = lib.mkDefault true;

  services.lair-keystore.enable = true;

  services.mingetty.autologinUser = "root";

  services.nginx = {
    enable = true;

    virtualHosts.default = {
      enableACME = true;
      onlySSL = true;
      locations = {
        "/" = {
          alias = "${pkgs.host-console-ui}/";
          extraConfig = ''
            limit_req zone=zone1 burst=30;
          '';
        };

        "/apps/" = {
          alias = "${configureHolochainWorkingDir}/uis/";
          extraConfig = ''
            limit_req zone=zone1 burst=30;
          '';
        };

        "~ ^/admin(?:/.*)?$" = {
            extraConfig = ''
              rewrite ^/admin.*$ / last;
              return 404;
            '';
        };

        "~ ^/holofuel(?:/.*)?$" = {
            extraConfig = ''
              rewrite ^/holofuel.*$ / last;
              return 404;
            '';
        };

        "/api/v1/" = {
          proxyPass = "http://unix:/run/hpos-admin-api/hpos-admin-api.sock:/";
          extraConfig = ''
            auth_request /auth/;
          '';
        };

        "/api/v1/ws/" = {
          proxyPass = "http://127.0.0.1:42233";
          proxyWebsockets = true;
          extraConfig = ''
            proxy_send_timeout 1d;
            proxy_read_timeout 1d;
          '';
        };

        "/holochain-api/v1/" = {
          proxyPass = "http://unix:/run/hpos-holochain-api/hpos-holochain-api.sock:/";
          extraConfig = ''
            auth_request /auth/;
          '';
        };

        "/auth/" = {
          proxyPass = "http://127.0.0.1:2884";
          extraConfig = ''
            internal;
            proxy_set_header X-Original-URI $request_uri;
            proxy_set_header X-Original-Method $request_method;
            proxy_pass_request_body off;
            proxy_set_header Content-Length "";
          '';
        };

        "/hosting/" = {
          proxyPass = "http://127.0.0.1:4656";
          proxyWebsockets = true;   # TODO: add proxy_send_timeout, proxy_read_timeout HERE
        };

         "/trycp/" = {
          proxyPass = "http://127.0.0.1:9000";
          proxyWebsockets = true; 
        };
      };
    };

    virtualHosts.localhost = {
        locations."/".proxyPass = "http://unix:/run/hpos-admin-api/hpos-admin-api.sock:/";
      };

    appendHttpConfig = ''
      limit_req_zone $binary_remote_addr zone=zone1:1m rate=2r/s;
      types {
        application/wasm wasm;
      }
    '';
  };

  services.holochain = lib.mkDefault {
    enable = true;
    working-directory = holochainWorkingDir;
    config = {
      environment_path = "${holochainWorkingDir}/databases";
      keystore_path = "${holochainWorkingDir}/lair-keystore";
      use_dangerous_test_keystore = false;
      admin_interfaces = [
        {
          driver = {
            type = "websocket";
            port = 4444;
          };
        }
      ];
      network = {
        bootstrap_service = "https://bootstrap.holo.host";
        transport_pool = [{
          type = "proxy";
          sub_transport = {
            type = "quic";
          };
          proxy_config = {
            type = "remote_proxy_client";
            proxy_url = "kitsune-proxy://nFCWLsuRC0X31UMv8cJxioL-lBRFQ74UQAsb8qL4XyM/kitsune-quic/h/proxy.holochain.org/p/5775/--";
          };
        }];
      };
    };
  };

  services.configure-holochain = lib.mkDefault {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      core_happs = [
        {
          app_id = "core-hha";
          uuid = "0001";
          version = "alpha0";
          /* dna_url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.0.1-alpha7/holo-hosting-app.dna.gz"; */
          dna_path = builtins.fetchurl {
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.0.1-alpha7/holo-hosting-app.dna.gz";
            sha256 = "1dp7xznk0jhv9yswcpp68d9zi5wpl1xfwbh3mpl66zv62cpl12zq"; # To get sha run `nix-prefetch-url URL`
          };
        }
        {
          app_id = "servicelogger";
          uuid = "0001";
          version = "alpha0";
          /* dna_url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.0.1-alpha5/servicelogger.dna.gz"; */
          dna_path = builtins.fetchurl {
            url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.0.1-alpha5/servicelogger.dna.gz";
            sha256 = "14wc0fiqv1jzhgpa9kqiyhg3ncn8p5vcmj9gmf2k1ah8izh8h70h"; # To get sha run `nix-prefetch-url URL`
          };
        }
      ];
      self_hosted_happs = [];
    };
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = lib.mkDefault true;
    dates = "*:0/10";
  };

  system.holo-nixpkgs.usbReset = {
    enable = lib.mkDefault true;
    filename = "hpos-reset";
  };

  systemd.services.acme-default.serviceConfig.ExecStart =
    lib.mkForce "${holo-router-acme}/bin/holo-router-acme";

  systemd.services.acme-default.serviceConfig.WorkingDirectory =
    lib.mkForce "${config.security.acme.certs.default.directory}";

  system.stateVersion = "20.09";

  users.groups.apis = {};

  users.users.nginx.extraGroups = [ "apis" ];

  users.users.holo.isNormalUser = true;

  users.users.root.hashedPassword = "*";
}
