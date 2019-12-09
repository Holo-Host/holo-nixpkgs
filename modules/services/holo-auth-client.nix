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
      after = [ "network.target" "zerotierone.service" ];

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

        echo >&2 "Zerotier status, start: $(zerotier_status)"

        while [ "$(zerotier_status)" = "REQUESTING_CONFIGURATION" ]; do
          echo >&2 "Awaiting requested ZeroTier configuration..."
          sleep 3
        done

        if [ "$(zerotier_status)" = "ACCESS_DENIED" ] \
            || [ ! -s holo-keystore ] || [ ! -s holo-keystore.pub ]; then
          # Not yet authorized w/ Zerotier, or the derived keystore is missing/empty
          echo >&2 "Running HPOS init..."
          while ! HPOS_STATE_PATH=$(hpos-init) || [ -z "$HPOS_STATE_PATH" ]; do
            # Perhaps receiving/parsing/saving hpos-state.json failed/empty; try again...
            echo >&2 "Failed to acheive HPOS Init; retrying..."
          done
          export HPOS_STATE_PATH
          echo >&2 "HPOS Init successful, with path $HPOS_STATE_PATH"

          mkdir -p /var/lib/holochain-conductor
          cd /var/lib/holochain-conductor

          echo >&2 "Deriving Holo keystore to $HPOS_STATE_PATH/holo-keystore..."
          if ! hpos-state-derive-keystore < $HPOS_STATE_PATH > holo-keystore 2> holo-keystore.pub; then
            echo >&2 "Failed to derive keys from $HPOS_STATE_PATH"
            exit 1
          fi
          export HOLO_PUBLIC_KEY=$(cat holo-keystore.pub)
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
