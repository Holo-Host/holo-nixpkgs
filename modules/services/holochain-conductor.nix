{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holochain-conductor;
in

{
  options.services.holochain-conductor = {
    enable = mkEnableOption "Holochain Conductor";

    config = mkOption {
      type = types.attrs;
    };
    available-happs = mkOption {
      type = types.listOf types.attrs;
    };

    package = mkOption {
      default = pkgs.holochain-rust;
      type = types.package;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.holochain-conductor = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      preStart = ''
        ${pkgs.hpos-config-into-keystore}/bin/hpos-config-into-keystore \
          < $HPOS_CONFIG_PATH > /tmp/holo-keystore 2> /tmp/holo-keystore.pub
        export HOLO_KEYSTORE_HCID=$(cat /tmp/holo-keystore.pub)
        if [[ ! -f $STATE_DIRECTORY/conductor-config.toml || ! -n $HPOS_OVERRIDE_CONDUCTOR_CONFIG ]]; then
          ${pkgs.envsubst}/bin/envsubst < ${pkgs.writeTOML cfg.config} \
            | ${pkgs.holo-update-conductor-config}/bin/holo-update-conductor-config \
            $STATE_DIRECTORY/conductor-config.toml
        fi
        HOSTED_HAPPS_CONFIG=${pkgs.writeText "hosted-happs.json" (builtins.toJSON cfg.available-happs)}
        echo "Wrote available-happs config to $HOSTED_HAPPS_CONFIG"
        ln -fs $HOSTED_HAPPS_CONFIG /var/lib/holochain-conductor/hosted-happs.json
      '';

      serviceConfig = {
        User = "holochain-conductor";
        Group = "holochain-conductor";
        ExecStart = "${cfg.package}/bin/holochain -c /var/lib/holochain-conductor/conductor-config.toml";
        StateDirectory = "holochain-conductor";
      };
    };

    users.users.holochain-conductor = {
      isSystemUser = true;
      home = "/var/lib/holochain-conductor";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.holochain-conductor = {};
  };
}
