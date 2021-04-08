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
      environment_path = "${holochainWorkingDir}/databases";
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

  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      core_happs = [
        {
          app_id = "core-app"; # not used, just for clarity here
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.1.0-alpha5/core-app.0_1_0_alpha5.happ";
            sha256 = "06mwyn6wf6kq6qqxf1fpvl6rbw940mgw3jaqf59swrqszpa23g00"; # To get sha run `nix-prefetch-url URL`
          };
        }
        {
          app_id = "servicelogger";  # not used, just for clarity here
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.1.0-alpha4/servicelogger.0_1_0-alpha4.happ";
            sha256 = "0z128p7pcnay78w4z3cfka55z29win8hdraifz73xnlwq1bm0w3v"; # To get sha run `nix-prefetch-url URL`
          };
        }
      ];
      self_hosted_happs = [
        {
          app_id = "elemental-chat";  # not used, just for clarity here
          bundle_url =  builtins.fetchurl {
            url = "https://github.com/holochain/elemental-chat/releases/download/v0.2.0-alpha3/elemental-chat.0_2_0_alpha3.happ";
            sha256 = "1y9naf3dbkxz5bjb0dz16bscpv97r9pwlm0zya3ms3kfldwwznd3";
          };
          ui_url = builtins.fetchurl {
            url = "https://github.com/holochain/elemental-chat-ui/releases/download/v0.0.1-alpha31/elemental-chat.zip";
            sha256 = "1a3viqrsjcz0n0wrl3wzwm9raamm5292gl0kl449ziwdp4b3vik6";
          };
        }
      ];
    };
  };

  services.lair-keystore.enable = true;

}
