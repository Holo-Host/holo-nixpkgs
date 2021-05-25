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
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/0_1_0_alpha17/core-app.0_1_0_alpha17.happ";
            sha256 = "0fxijd1nxyqp1ca933n04sv8xjl3hdhz86xgbz0mkr28lfmrb12x"; # To get sha run `nix-prefetch-url URL`
          };
        }
        {
          app_id = "servicelogger";  # not used, just for clarity here
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.1.0-alpha7/servicelogger.0_1_0-alpha7.happ";
            sha256 = "1h9yjrrk13h965ycww5r6y4drqcxw2g3p7a4f8dfszqkjyx0pwm7"; # To get sha run `nix-prefetch-url URL`
          };
        }
      ];
      self_hosted_happs = [
        {
          app_id = "elemental-chat";  # not used, just for clarity here
          bundle_path =  builtins.fetchurl {
            url = "https://github.com/holochain/elemental-chat/releases/download/v0.2.0-alpha11/elemental-chat.0_2_0_alpha11.happ";
            sha256 = "10bjw1rgzzynmhxx16j5kzdbc2srvkq68dsgfx9dmqdi8yy93y22";
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

}
