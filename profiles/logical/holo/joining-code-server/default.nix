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
      core_happs = [{
          app_id = "joining-code-factory";
          uuid = "0001";
          version = "alpha1";
          dna_url = "https://s3.wasabisys.com/holo/joining-code-factory.happ";
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

  services.joining-code-factory.enable = true;

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
}
