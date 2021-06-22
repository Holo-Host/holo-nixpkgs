{ config, lib, pkgs, ... }:

with pkgs;

let 
  credentialsDir = "/var/lib/credentials";

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";

  settings = import ../../global-settings.nix { inherit config; };
in

{
  imports = [
    ../.
  ];

  environment.systemPackages = [ hc-state git hpos-update-cli holochain hc kitsune-p2p-proxy ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.lair-keystore.enable = true;

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
        bootstrap_service = settings.holoNetwork.bootstrapUrl;
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
      core_happs = [{
          app_id = "joining-code-factory";
          uuid = "0001";
          version = "alpha1";
          dna_url = "https://drive.google.com/u/1/uc?id=1HJTYk5leGBQvpqKEHkrNi1ils4Z9_tPw&export=download";
        }];
    };
    membrane-proofs = {
      payload = [
        {
          cell_nick = "jcf";
          proof = "AA==";  #read-only membrane proof
        }
      ];
    };
  };

  services.joining-code-factory = {
    enable = true;
    credentialsDir = "/var/lib/credentials";
    happName = "elemental%20chat";
    appId = "joining-code-factory:alpha1";
    dnaNick = "jcf";
  };

#  security.acme = {
#    acceptTerms = true;
#    # REVIEW: maybe a dedicated email for Hydra?
#    email = "oleksii.filonenko@holo.host";
#  };

  # system.holo-nixpkgs.autoUpgrade = {
  #   enable = true;
  #   dates = "*:0/10";
  # };

  users.groups.apis = {};

  users.users.nginx.extraGroups = [ "apis" ];
}
