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
      after = [ "network.target" "zerotierone.service" "systemd-logind.service" ];

      path = with pkgs; [
        hpos-init
        hpos-state-derive-keystore
        jq
        utillinux
        zerotierone
      ];

      wantedBy = [ "multi-user.target" ];

      script = ''
        #
        # Phase 1: locate `hpos-state.json`; export HPOS_STATE_PATH
        # NOTE: This *requires* us to be able to communicate via the console, hence the
        # require/after for systemd-logind.service
        #
        echo >&2 "Running HPOS init..."
        while ! HPOS_STATE_PATH=$(hpos-init) || [ -z "$HPOS_STATE_PATH" ]; do
          # Perhaps receiving/parsing/saving hpos-state.json failed/empty; try again...
          echo >&2 "Failed to acheive HPOS Init; retrying..."
        done
        export HPOS_STATE_PATH
        echo >&2 "HPOS Init successful, with path $HPOS_STATE_PATH"

        #
        # Phase 2: Derive Holochain keys; export HOLO_PUBLIC_KEY
        #
        mkdir -p /var/lib/holochain-conductor
        cd /var/lib/holochain-conductor

        echo >&2 "Deriving Holo keystore to $HPOS_STATE_PATH/holo-keystore..."
        if ! hpos-state-derive-keystore < $HPOS_STATE_PATH > holo-keystore 2> holo-keystore.pub; then
          echo >&2 "Failed to derive keys from $HPOS_STATE_PATH"
          exit 1
        fi
        export HOLO_PUBLIC_KEY=$(cat holo-keystore.pub)

        #
        # Phase 3: Monitor Zerotier status, triggering Holo Auth if necessary
        #
        zerotier_status() {
          zerotier-cli -j listnetworks | jq -r .[0].status
        }

        while [ "$(zerotier_status)" = "REQUESTING_CONFIGURATION" ]; do
          echo >&2 "Awaiting requested ZeroTier configuration..."
          sleep 1
        done
        if [ "$(zerotier_status)" = "ACCESS_DENIED" ]; then
          echo >&2 "Authorizing Holo Auth Agent ID: $HOLO_PUBLIC_KEY..."
          exec ${cfg.package}/bin/holo-auth-client
        fi
        echo >&2 "Zerotier status, final: $(zerotier_status)"
      '';

      serviceConfig = {
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
