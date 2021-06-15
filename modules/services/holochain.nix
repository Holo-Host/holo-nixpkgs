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

    hc-lmdb-size = mkOption {
      default = "1073741824"; # 1G by default
      type = types.str;
    };

    working-directory = mkOption {
      type = types.path;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.holochain = {
      after = [ "network.target" "holo-envoy.service" ];
      requires = [ "holo-envoy.service" ];
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "debug";
      environment.HC_LMDB_SIZE = cfg.hc-lmdb-size;

      preStart = ''
        ${pkgs.envsubst}/bin/envsubst < ${pkgs.writeJSON cfg.config} > $STATE_DIRECTORY/holochain-config.yaml
        sleep .5 # wait for keystore socket to be ready
      '';

      serviceConfig = {
        User = "holochain-rsm";
        Group = "holochain-rsm";
        ExecStart = "/run/current-system/sw/bin/echo $(ulimit -Sn) && ${cfg.package}/bin/holochain -c ${cfg.working-directory}/holochain-config.yaml";
        StateDirectory = "holochain-rsm";
        Restart = "always";
        RestartSec = 1;
        Type = "notify";
        NotifyAccess = "exec";
        LimitNOFILE = 524288;
      };

      postStart = ''
        ulimit -Sn
      '';
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
