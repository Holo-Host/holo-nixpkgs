{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holochain;
in

{
  options.services.holochain = {
    enable = mkEnableOption "Holochain";

    config = mkOption {
      type = types.attrs;
    };

    package = mkOption {
      default = pkgs.holochain;
      type = types.package;
    };

    working-directory = mkOption {
      type = types.path;
    };

    restart-interval = mkOption {
      description = ''
        Update interval in systemd.time(7) units.
      '';
      example = "1 h";
      type = types.str;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.holochain = {
      after = [ "network.target" "lair-keystore.service" "holo-envoy.service" ];
      requires = [ "lair-keystore.service" "holo-envoy.service" ];
      wantedBy = [ "multi-user.target" ];

      #environment.RUST_LOG = "debug";
      environment.HC_LMDB_SIZE = "1073741824";  # 1G instead of default 100M

      preStart = ''
        ${pkgs.envsubst}/bin/envsubst < ${pkgs.writeJSON cfg.config} > $STATE_DIRECTORY/holochain-config.yaml
        sleep .1 # wait for keystore socket to be ready
      '';

      serviceConfig = {
        User = "holochain-rsm";
        Group = "holochain-rsm";
        ExecStart = "${cfg.package}/bin/holochain -c ${cfg.working-directory}/holochain-config.yaml";
        StateDirectory = "holochain-rsm";
      };
    };

    systemd.services.holochain-restarter = {
      serviceConfig.Type = "oneshot";

      script = ''
        ${pkgs.systemd}/bin/systemctl try-restart holochain.service
      '';

      startAt = cfg.restart-interval;
    };

    users.users.holochain-rsm = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.holochain-rsm = {};
  };
}
