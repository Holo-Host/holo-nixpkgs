{ config, lib, pkgs, ... }:

with pkgs;

let
  settings = import ../global-settings.nix { inherit config; };

  acmeCfg = config.security.acme.certs."${settings.holoNetwork.networkName}";

  holo-router-acme = writeShellScriptBin "holo-router-acme" ''
    base36_id=$(${hpos-config}/bin/hpos-config-into-base36-id < "$HPOS_CONFIG_PATH")
    until $(${curl}/bin/curl --fail --head --insecure --max-time 10 --output /dev/null --silent "https://$base36_id.${settings.holoNetwork.hposDomain}"); do
      sleep 5
    done
    ${simp_le}/bin/simp_le \
      --default_root ${acmeCfg.webroot} \
      --valid_min ${toString (config.security.acme.validMinDays * 24 * 60 * 60)} \
      -d "$base36_id.${settings.holoNetwork.hposDomain}" \
      -f fullchain.pem \
      -f full.pem \
      -f chain.pem \
      -f cert.pem \
      -f key.pem \
      -f account_key.json \
      -f account_reg.json \
      -v
    exitcode=$?

    if [[ $exitcode == 0 || $exitcode == 1 ]]; then
      exit 0
    fi

    exit $exitcode
  '';

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";
in

{
  imports = [
    ../.
    ../binary-cache.nix
    ../self-aware.nix
  ];

  boot.loader.grub.splashImage = ./splash.png;
  boot.loader.timeout = 1;

  # REVIEW: `true` breaks gtk+ builds (cairo dependency)
  environment.noXlibs = false;

  environment.systemPackages = with holochainAllBinariesWithDeps.hpos; [
    git
    hc-state
    lair-shim
    hpos-admin-client
    hpos-holochain-client
    hpos-reset
    hpos-update-cli
    holo-cli
    holochain
    hc
    kitsune-p2p-proxy
  ];

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

  services.holo-router-agent = {
    enable = lib.mkDefault true;
    registryUrl = settings.holoNetwork.routerRegistry.url;
  };

  services.hp-admin-crypto-server.enable = true;

  services.hpos-admin-api.enable = true;

  services.hpos-holochain-api = lib.mkDefault {
    enable = true;
    working-directory = configureHolochainWorkingDir;
  };

  services.hpos-init = {
    enable = lib.mkDefault true;
    networkName = settings.holoNetwork.networkName;
  };

  services.lair-keystore.enable = true;

  services.mingetty.autologinUser = "root";

  services.hpos-led-manager.kitsuneAddress = settings.holoNetwork.proxy.kitsuneAddress;

  services.nginx = {
    enable = true;

    virtualHosts."${settings.holoNetwork.networkName}" = {
      enableACME = true;
      onlySSL = true;
      locations = {
        "/" = {
          alias = "${pkgs.host-console-ui}/";
          tryFiles = ''
             $uri $uri/ /index.html
           '';
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

        "/hosted/" = {
          alias = "${configureHolochainWorkingDir}/hosted-uis/";
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
        locations."/holochain-api/".proxyPass = "http://unix:/run/hpos-holochain-api/hpos-holochain-api.sock:/";
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
      environment_path = "${holochainWorkingDir}/databases_lmdb4";
      keystore_path = "${holochainWorkingDir}/lair-shim";
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
        bootstrap_service = settings.holoNetwork.bootstrapUrl;
        network_type = "quic_bootstrap";
        transport_pool = [{
          type = "proxy";
          sub_transport = {
            type = "quic";
          };
          proxy_config = {
            type = "remote_proxy_client";
            proxy_url = settings.holoNetwork.proxy.kitsuneAddress;
          };
        }];
        tuning_params = {
          gossip_loop_iteration_delay_ms = 1000; # Default was 10
          default_notify_remote_agent_count = 5;
          default_notify_timeout_ms = 1000;
          default_rpc_single_timeout_ms = 20000;
          default_rpc_multi_remote_agent_count = 2;
          default_rpc_multi_timeout_ms = 2000;
          agent_info_expires_after_ms = 1000 * 60 * 30; #// Default was 20 minutes
          tls_in_mem_session_storage = 512;
          proxy_keepalive_ms = 1000 * 60 * 2;
          proxy_to_expire_ms = 1000 * 60 * 5;
        };
      };
    };
  };

  systemd.globalEnvironment.DEV_UID_OVERRIDE = "jack0002";

  services.holo-auto-installer = lib.mkDefault {
    enable = true;
    working-directory = configureHolochainWorkingDir;
  };

  services.configure-holochain = lib.mkDefault {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      core_happs = [
       {
         app_id = "core-app";
         bundle_url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/0_1_0_alpha20/core-app.0_1_0_alpha20.happ";
       }
       {
         app_id = "servicelogger";
         bundle_url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/0_1_0_alpha8/servicelogger.0_1_0_alpha8.happ";
       }
      ];
      self_hosted_happs = [
        {
          bundle_url = "https://github.com/holochain/elemental-chat/releases/download/v0.2.0.alpha13/elemental-chat.0_2_0_alpha13.happ";
          ui_url = "https://github.com/holochain/elemental-chat-ui/releases/download/v0.0.1-alpha34/elemental-chat-for-dna-0_2_0_alpha11-develop.zip";
        }
      ];
    };
    membrane-proofs = {
      payload = [
        {
          cell_nick = "elemental-chat";
          proof = "AA==";  #read-only membrane proof
        }
      ];
    };
  };

  services.zerotierone = {
    enable = lib.mkDefault true;
    joinNetworks = [ settings.holoNetwork.zerotierNetworkID ];
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = lib.mkDefault true;
    interval = "10min";
  };

  system.holo-nixpkgs.usbReset = {
    enable = lib.mkDefault true;
    filename = "hpos-reset";
  };

  systemd.services."acme-${settings.holoNetwork.networkName}" = {
    serviceConfig = {
      ExecStart = lib.mkForce "${holo-router-acme}/bin/holo-router-acme";
      WorkingDirectory = lib.mkForce "${acmeCfg.directory}";
    };
  };

  system.stateVersion = "20.09";

  users.groups.apis = {};

  users.users.nginx.extraGroups = [ "apis" ];

  users.users.holo.isNormalUser = true;

  users.users.root.hashedPassword = "*";
}
