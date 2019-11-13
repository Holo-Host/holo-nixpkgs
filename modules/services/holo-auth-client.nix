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

      path = [
        pkgs.hpos-init
        pkgs.hpos-state-derive-keystore
        pkgs.utillinux
        pkgs.zerotierone
      ];

      wantedBy = [ "multi-user.target" ];

      script = ''
        export HPOS_STATE_PATH=$(hpos-init)

        mkdir -p /var/lib/holochain-conductor

        cd /var/lib/holochain-conductor
        if [ ! -f holo-keystore ]; then
          hpos-state-derive-keystore < $HPOS_STATE_PATH > holo-keystore
        fi

        exec ${cfg.package}/bin/holo-auth-client
      '';

      serviceConfig.User = "root";
    };
  };
}
