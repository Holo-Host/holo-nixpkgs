{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-configure-holochain;
in

{
  options.services.hpos-configure-holochain = {
    enable = mkEnableOption "hpos-configure-holochain";

    default-self-hosted-list = mkOption {
      type = types.listOf types.attrs;
    };

    package = mkOption {
      default = pkgs.hpos-configure-holochain;
      type = types.package;
    };

    self-hosted-working-directory = mkOption {
      default = "";
    };

    working-directory = mkOption {
      default = "";
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package pkgs.nodejs ];

    systemd.services.hpos-configure-holochain = {
      after = [ "network.target" "holochain.service" ];
      requisite = [ "holochain.service" ];
      wantedBy = [ "multi-user.target" ];

      preStart = ''
        ${pkgs.envsubst}/bin/envsubst < ${pkgs.writeJSON cfg.default-list} > ${cfg.self-hosted-working-directory}/config.yaml
        sleep 2 # wait for holochian admin interface to be ready
      '';

      serviceConfig = {
        User = "hpos-configure-holochain";
        Group = "hpos-configure-holochain";
        # FIXME binary
        ExecStart = "${pkgs.nodejs}/bin/node --no-warnings ${cfg.package}/main.js ${cfg.working-directory}/config.yaml";
        StateDirectory = "hpos-configure-holochain";
        Type = "oneshot";
      };
    };

    users.users.hpos-configure-holochain = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.hpos-configure-holochain = {};
  };
}
