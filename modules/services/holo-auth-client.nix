{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-auth-client;
in

{
  options.services.holo-auth-client = {
    enable = mkEnableOption "Holo Auth Client";

    package = mkOption {
      default = pkgs.holo-auth-client;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-auth-client = {
      after = [ "network.target" "systemd-logind.service" "zerotierone.service" ];

      path = with pkgs; [
        hpos-init
        hpos-state-derive-keystore
        jq
        utillinux
        zerotierone
      ];

      wantedBy = [ "multi-user.target" ];

      script = ''
        zerotier_status() {
          zerotier-cli -j listnetworks | jq -r .[0].status
        }

        while [ "$(zerotier_status)" = "REQUESTING_CONFIGURATION" ]; do
          sleep 1
        done

        export HPOS_STATE_PATH=$(hpos-init)

        mkdir -p /var/lib/holochain-conductor
        cd /var/lib/holochain-conductor

        hpos-state-derive-keystore < $HPOS_STATE_PATH > holo-keystore 2> holo-keystore.pub
        export HOLO_PUBLIC_KEY=$(cat holo-keystore.pub)

        if [ "$(zerotier_status)" = "ACCESS_DENIED" ]; then
          exec ${cfg.package}/bin/holo-auth-client
        fi
      '';

      serviceConfig = {
        RemainAfterExit = true;
        Type = "oneshot";
        User = "root";
      };
    };

    systemd.services.holochain-conductor = {
      after = [ "holo-auth-client.service" ];
      requires = [ "holo-auth-client.service" ];
    };

    systemd.services.holo-router-agent = {
      after = [ "holo-auth-client.service" ];
      requires = [ "holo-auth-client.service" ];
    };

    systemd.services.hp-admin-crypto-server = {
      after = [ "holo-auth-client.service" ];
      requires = [ "holo-auth-client.service" ];
    };
  };
}
