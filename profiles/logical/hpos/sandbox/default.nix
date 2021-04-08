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
          app_id = "core-apps";
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.1.0-alpha4/core-app.0_1_0-alpha4.happ";
            sha256 = "1s3np5wr8caq2977qs4f03fj8p8wv3z51wdw71hq3wm8lllwljlv"; # To get sha run `nix-prefetch-url URL`
          };
        }
        {
          app_id = "servicelogger";
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/servicelogger-rsm/releases/downloads/v0.1.0-alpha5/servicelogger.0_1_0-alpha5.happ";
            sha256 = "1vi3d8v81dx7iij3ckdmsdnfd7rmwcd7635v765n6i7pihq7kfwr"; # To get sha run `nix-prefetch-url URL`
          };
        }
      ];
      self_hosted_happs = [];
    };
  };

  services.lair-keystore.enable = true;

}
