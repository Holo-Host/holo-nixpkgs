{ config, lib, pkgs, ... }:

with pkgs;

let 
  matchServiceApiSocket = "unix:/run/match-service-api.sock";

  matchServerCredentialsDir = "/var/lib/match-server-credentials";

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";

  kitsuneAddress = "kitsune-proxy://f3gH2VMkJ4qvZJOXx0ccL_Zo5n-s_CnBjSzAsEHHDCA/kitsune-quic/h/45.55.107.33/p/5788/--";
in

{
  imports = [
    ../.
  ];

  environment.systemPackages = [ hc-state git hpos-update-cli holochain hc kitsune-p2p-proxy ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.lair-keystore.enable = true;

  services.holo-envoy.enable = lib.mkDefault true; # Enabling because Holochain systemd service depends on it. We're not using it or lair-shim

  services.holochain = lib.mkDefault {
    enable = true;
    working-directory = holochainWorkingDir;
    config = {
      environment_path = "${holochainWorkingDir}/databases_lmdb4";
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
        bootstrap_service = "https://bootstrap-staging.holo.host";
        network_type = "quic_bootstrap";
        transport_pool = [{
          type = "proxy";
          sub_transport = {
            type = "quic";
          };
          proxy_config = {
            type = "remote_proxy_client";
            proxy_url = kitsuneAddress;
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

  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      self_hosted_happs = [];
      core_happs = [
       {
         app_id = "core-app";
         bundle_url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/0_1_0_alpha16/core-app.0_1_0_alpha16.happ";
       }
       {
         app_id = "servicelogger";
         bundle_url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.1.0-alpha7/servicelogger.0_1_0-alpha7.happ";
       }
      ];
    };
    membrane-proofs = {
      payload = [
        {
          cell_nick = "elemental-chat";
          proof = "3gACrXNpZ25lZF9oZWFkZXLeAAKmaGVhZGVy3gACp2NvbnRlbnTeAAekdHlwZaZDcmVhdGWmYXV0aG9yxCeEICR/PJxdzJx345LodAe+FOB4NWOWQV0Tb5cfP5/8AL/nF6VBfU2pdGltZXN0YW1wks5gUzqazhJyV9WqaGVhZGVyX3NlcQmrcHJldl9oZWFkZXLEJ4QpJEIwak+vC8awMx0vdAe8XSbRRage/CuXmCjRhkkTtWWAUUOp8qplbnRyeV90eXBl3gABo0FwcN4AA6JpZACnem9tZV9pZACqdmlzaWJpbGl0ed4AAaZQdWJsaWPAqmVudHJ5X2hhc2jEJ4QhJAf4ZKktdaQZ6JJj4l+UDRCTwspZSchRPYXtwbdRVvyQBnB8ZqRoYXNoxCeEKSSebKOWLx1D9uHxPBkzVjOgm3gtO6w8VkiiEvigSfgTeFWLVN+pc2lnbmF0dXJlxEC+3INgyz2PfsiwtpBpTZIcx0JYVy9t7rYp2HWnK5x9Vw/uITWUzfIO4uaNl6MQppfkraxHLeNZqamjyEtRWggApWVudHJ53gABp1ByZXNlbnTeAAKqZW50cnlfdHlwZaNBcHClZW50cnnEMoKkcm9sZalkZXZlbG9wZXKucmVjb3JkX2xvY2F0b3Kybmljb2xhc0BsdWNrc3VzLmV1";
        }
      ];
    };
  };

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
}
