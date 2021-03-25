{ config, lib, pkgs, ... }:

with pkgs;

let
  holochainWorkingDir = "/var/lib/holochain-rsm";

  configureHolochainWorkingDir = "/var/lib/configure-holochain";
in

{
  imports = [ ../. ];

  services.holo-auth-client.enable = false;

  services.holo-router-agent.enable = false;

  services.hpos-init.enable = false;

  services.holo-envoy.enable = false;

  services.zerotierone.enable = false;

  system.holo-nixpkgs.autoUpgrade.enable = false;

  system.holo-nixpkgs.usbReset.enable = false;

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
        network_type = "quic_bootstrap";
        transport_pool = [{
          network_type = "quic_bootstrap";
          type = "mem";
        }];
      };
    };
  };

  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      core_happs = [
        {
          app_id = "core-happs";
          uuid = "0001";
          version = "alpha0";
          /* dna_url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.0.1-alpha6/holo-hosting-app.dna.gz"; */
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.1.0-alpha1/holo-hosting-app.happ";
            sha256 = "1mrmvgcx014bg9z4hk4i1ypfq4wwmqh5kgw02pis9yxnlk4jl3sb"; # To get sha run `nix-prefetch-url URL`
          };
        }
        {
          app_id = "servicelogger";
          uuid = "0001";
          version = "alpha0";
          /* dna_url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.0.1-alpha4/servicelogger.dna.gz"; */
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.1.0-alpha2/servicelogger.happ";
            sha256 = "0jygfivfbl7v3z85iv5j56s4gd7ww90n98vid1503rxd983ankb2"; # To get sha run `nix-prefetch-url URL`
          };
        }
      ];
      self_hosted_happs = [
        /* {
          app_id = "elemental-chat";
          uuid = "0666";
          version = "alpha14";
          ui_url = "https://github.com/holochain/elemental-chat-ui/releases/download/v0.0.1-alpha20/elemental-chat.zip";
          dna_url = "https://github.com/holochain/elemental-chat/releases/download/v0.0.1-alpha14/elemental-chat.dna.gz";
          } */
      ];
    };
  };

  services.lair-keystore.enable = true;

}
