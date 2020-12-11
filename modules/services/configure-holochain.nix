{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.configure-holochain;
in

{
  options.services.configure-holochain = {
    enable = mkEnableOption "configure-holochain";

    install-list = mkOption {
      type = types.listOf types.attrs;
    };

    package = mkOption {
      default = pkgs.configure-holochain;
      type = types.package;
    };

    working-directory = mkOption {
      default = "";
    };
  };

  config = mkIf (cfg.enable) {
    systemd.services.configure-holochain = {
      after = [ "network.target" "holochain.service" ];
      requisite = [ "holochain.service" ];
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "debug";
      environment.UI_STORE_FOLDER = "${cfg.working-directory}/uis";
      path = with pkgs; [ unzip ];

      preStart = ''
        ${pkgs.envsubst}/bin/envsubst < ${pkgs.writeJSON cfg.install-list} > ${cfg.working-directory}/config.yaml
        sleep 2 # wait for holochian admin interface to be ready
      '';

      serviceConfig = {
        User = "configure-holochain";
        Group = "configure-holochain";
        ExecStart = "${cfg.package}/hpos-configure-holochain ${cfg.working-directory}/config.yaml";
        StateDirectory = "configure-holochain";
        Type = "oneshot";
      };
    };

    users.users.configure-holochain = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.configure-holochain = {};
  };
}
