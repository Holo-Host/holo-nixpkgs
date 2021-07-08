{ config, lib, pkgs, ... }:

with pkgs;

let
  matchServiceApiSocket = "unix:/run/match-service-api.sock";

  matchServerCredentialsDir = "/var/lib/match-server-credentials";

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";

  settings = import ../../global-settings.nix;

  networks = import ../../holo-networks.nix;

  holoNetwork = networks.selectNetwork config.system.holoNetwork;
in

{
  imports = [
    ../.
  ];

  environment.systemPackages = [ hc-state git hpos-update-cli hpos-holochain-client holochain hc kitsune-p2p-proxy ];

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
        bootstrap_service = holoNetwork.bootstrapUrl;
        network_type = "quic_bootstrap";
        transport_pool = [{
          type = "proxy";
          sub_transport = {
            type = "quic";
          };
          proxy_config = {
            type = "remote_proxy_client";
            proxy_url = holoNetwork.proxy.kitsuneAddress;
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

  systemd.globalEnvironment.DEV_UID_OVERRIDE = "pre-release-01";
  
  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      self_hosted_happs = [];
      core_happs = [
       {
         app_id = "core-app";
         bundle_url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/0_1_0_alpha21/core-app.0_1_0_alpha21.happ";
       }
       {
         app_id = "servicelogger";
         bundle_url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/0_1_0_alpha9/servicelogger.0_1_0_alpha9.happ";
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

#  security.acme = {
#    acceptTerms = true;
#    # REVIEW: maybe a dedicated email for Hydra?
#    email = "oleksii.filonenko@holo.host";
#  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = lib.mkDefault true;
    interval = "10min";
  };

  users.groups.apis = {};

  users.users.nginx.extraGroups = [ "apis" ];

  services.hpos-holochain-api.enable = true; # Temporary
}
