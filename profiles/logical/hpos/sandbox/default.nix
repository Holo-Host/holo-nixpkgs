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

  # overwrites configuration from ../default.nix because bundle_path is local
  services.configure-holochain = {
    enable = true;
    working-directory = configureHolochainWorkingDir;
    install-list = {
      core_happs = [
        {
          app_id = "core-app"; # not used, just for clarity here
          bundle_path = builtins.fetchurl {
            url = "https://holo-host.github.io/holo-hosting-app-rsm/releases/downloads/v0.1.0-alpha12/core-app.0_1_0_alpha12.happ";
            sha256 = "FIXME"; # To get sha run `nix-prefetch-url URL`
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
            url = "https://github.com/holochain/elemental-chat/releases/download/v0.2.0-alpha7/elemental-chat.0_2_0_alpha.happ";
            sha256 = "19j3kj5jsna4j732qmwjnwdvd2bcnihx4gs1yaqh8zrmm3r5rb0y";
          };
          ui_path = builtins.fetchurl {
            url = "https://github.com/holochain/elemental-chat-ui/releases/download/v0.0.1-alpha33/elemental-chat-for-dna-0_2_0_alpha7-develop.zip";
            sha256 = "1yd8rqfywwhd212mmc056x8kwc7nrmqssqzyzqp3iyg961iqjrfy";  # To get sha run `nix-prefetch-url URL`
          };
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

  services.lair-keystore.enable = true;

}
