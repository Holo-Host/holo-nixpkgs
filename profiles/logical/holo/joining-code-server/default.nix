{ config, lib, pkgs, ... }:

with pkgs;

let 
  credentialsDir = "/var/lib/credentials";

  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";
in

{
  imports = [
    ../.
  ];

  environment.systemPackages = [ hc-state git ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.lair-keystore.enable = true;

  services.joining-code-factory.enable = true;

  services.holochain = {
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
