{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-auth-client;
in

{
  options.services.holo-auth-client = {
    enable = mkEnableOption "Holo Auth Client";

    package = mkOption {
      default = pkgs.holo-auth;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-auth-client = {
      after = [ "network.target" "zerotierone.service" ];
      requires = [ "zerotierone.service" ];
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "info";
      path = with pkgs; [ jq zerotierone ];
      script = ''
        zerotier_status() {
          zerotier-cli -j listnetworks | jq -r .[0].status
        }

        while [ "$(zerotier_status)" = "REQUESTING_CONFIGURATION" ]; do
          sleep 1
        done

        if [ "$(zerotier_status)" = "ACCESS_DENIED" ]; then
          exec ${cfg.package}/bin/holo-auth-client
        fi
      '';

      serviceConfig = {
        RemainAfterExit = true;
        Type = "oneshot";
      };
    };
  };
}
