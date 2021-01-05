{ config, lib, pkgs, ... }:

with pkgs;

let 
  matchServiceApiSocket = "unix:/run/match-service-api.sock";

  matchServerCredentialsDir = "/var/lib/match-server-credentials";

  holochainWorkingDir = "/var/lib/holochain-rsm";

  selfHostedHappsWorkingDir = "/var/lib/self-hosted-happs";
in

{
  imports = [
    ../.
  ];

  environment.systemPackages = [ hc-state git ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.lair-keystore.enable = true;

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

  services.self-hosted-happs = {
    enable = true;
    working-directory = selfHostedHappsWorkingDir;
    default-list = [
      {
        # Replace this with HHA
        # app_id = "elemental-chat";
        # version = "alpha11";
        # ui_url = "https://github.com/holochain/elemental-chat-ui/releases/download/v0.0.1-alpha16/elemental-chat.zip";
        # dna_url = "https://github.com/holochain/elemental-chat/releases/download/v0.0.1-alpha11/elemental-chat.dna.gz";
      }
    ];
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

  services.nginx = {
    enable = true;

    virtualHosts.publicApi = {
      enableACME = true;
      locations = {
        "/".proxyPass = matchServiceApiSocket;
      };
      serverName = "network-statistics.holo.host";
    };
  };

  security.acme = {
    acceptTerms = true;
    # REVIEW: maybe a dedicated email for Hydra?
    email = "oleksii.filonenko@holo.host";
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    dates = "*:0/10";
  };
}
