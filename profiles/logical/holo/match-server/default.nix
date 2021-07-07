{ config, lib, pkgs, ... }:

with pkgs;

let
  matchServiceApiSocket = "unix:/run/match-service-api.sock";

  matchServerCredentialsDir = "/var/lib/match-server-credentials";

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";

  settings = import ../../global-settings.nix { inherit config; };

  
  test-holoports-switcher = writeShellScriptBin "test-holoports-switcher" ''
    ${test-hp-manager}/bin/test-holoports-switcher --ssh-key-path ${matchServerCredentialsDir}/id_rsa --config-path ${matchServerCredentialsDir}/config.json --target-channel "$@"
  '';

in

{
  imports = [
    ../.
  ];

  environment.systemPackages = [ hc-state git hpos-update-cli hpos-holochain-client holochain hc kitsune-p2p-proxy test-holoports-switcher ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.lair-keystore.enable = true;

  services.holo-envoy.enable = lib.mkDefault true; # Enabling because Holochain systemd service depends on it. We're not using it or lair-shim

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
          agent_info_expires_after_ms = 1000 * 60 * 30; #// Default was 20 minutes
        };
      };
    };
  };

  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      self_hosted_happs = [];
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
    };
    membrane-proofs = {
      payload = [
        {
          cell_nick = "elemental-chat";
          proof = "AA==";
        }
      ];
    };
  };

  services.kv-uploader = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.trancher = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.zt-collector = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.daily-uptime-calculator = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.match-service-api = {
    enable = true;
    socket = matchServiceApiSocket;
    credentialsDir = matchServerCredentialsDir;
  };

  services.hosted-happ-monitor = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };

  services.nginx = {
    enable = true;

    virtualHosts.publicApi = {
      enableACME = false;
      locations = {
        "/" = {
          proxyPass = "http://${matchServiceApiSocket}";
        };

        "/api/v1/ws/" = {
          proxyPass = "http://127.0.0.1:42233";
          proxyWebsockets = true;
        };
      };
      serverName = "network-statistics.holo.host";
    };

    virtualHosts.localhost = {
        locations."/holochain-api/".proxyPass = "http://unix:/run/hpos-holochain-api/hpos-holochain-api.sock:/";
      };
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = lib.mkDefault true;
    interval = "10min";
  };

  users.groups.apis = {};

  users.users.nginx.extraGroups = [ "apis" ];

  services.hpos-holochain-api.enable = true; # Temporary

  services.ssh-pinger = {
    enable = true;
    credentialsDir = matchServerCredentialsDir;
  };
}
