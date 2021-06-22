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

  services.holo-envoy.enable = true;

  services.zerotierone.enable = false;

  system.holo-nixpkgs.autoUpgrade.enable = false;

  system.holo-nixpkgs.usbReset.enable = false;

  services.holochain = {
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
        network_type = "quic_bootstrap";
        transport_pool = [{
          network_type = "quic_bootstrap";
          type = "mem";
        }];
      };
    };
  };

  # overwrites configuration from ../default.nix because bundle_path is local
  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      core_happs = [
        {
          app_id = "core-app"; # not used, just for clarity here
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/0_1_0_alpha21/core-app.0_1_0_alpha21.happ";
            sha256 = "0wgvp9np48a05nidwdb7piv2qqp0nwkbk8g84jg4w1qwn2ig6jk2"; # To get sha run `nix-prefetch-url URL`

          };
        }
        {
          app_id = "servicelogger";  # not used, just for clarity here
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/0_1_0_alpha9/servicelogger.0_1_0_alpha9.happ";
            sha256 = "05g08c1afqina7v0147py4p3nrvmhdnxll36p926h7riqz9fvxgz"; # To get sha run `nix-prefetch-url URL`
          };
        }
      ];
      self_hosted_happs = [
        {
          app_id = "elemental-chat";  # not used, just for clarity here
          bundle_path =  builtins.fetchurl {
            url = "https://github.com/holochain/elemental-chat/releases/download/v0.2.0.alpha13/elemental-chat.0_2_0_alpha13.happ";
            sha256 = "1y4i5922mjasf2qj0n6srfby1cpkid64a2r8kscfjwzgpr3k11ky";
          };
          ui_path = builtins.fetchurl {
            url = "https://github.com/holochain/elemental-chat-ui/releases/download/v0.0.1-alpha34/elemental-chat-for-dna-0_2_0_alpha11-develop.zip";
            sha256 = "0532izzbhlg0gaziz9sdd2w47v6rsw27gxldgn0k6015vpl7xrhd";  # To get sha run `nix-prefetch-url URL`
          };
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

  services.lair-keystore.enable = true;

  services.holo-auto-installer = lib.mkDefault {
    enable = true;
    working-directory = configureHolochainWorkingDir;
  };
  
}
