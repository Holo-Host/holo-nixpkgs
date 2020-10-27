{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.self-hosted-happs;
in

{
  options.services.self-hosted-happs = {
    enable = mkEnableOption "self-hosted-happs";

    default-list = mkOption {
      type = types.attrs;
    };

    package = mkOption {
      default = pkgs.self-hosted-happs-node;
      type = types.package;
    };

    working-directory = mkOption {
      default = "";
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package pkgs.nodejs ];

    systemd.services.self-hosted-happs = {
      after = [ "network.target" "holochain.service" ];
      requires = [ "holochain.service" ];
      wantedBy = [ "multi-user.target" ];

      preStart = ''
        # write config.yaml here
        sleep .1 # wait for holochian admin interface to be ready
      '';

      serviceConfig = {
        User = "self-hosted-happs";
        Group = "self-hosted-happs";
        ExecStart = "${pkgs.nodejs}/bin/node --no-warnings ${cfg.package}/main.js ${cfg.working-directory}/config.yaml";
        StateDirectory = "self-hosted-happs";
        Type = "oneshot";
      };
    };

    users.users.self-hosted-happs = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.self-hosted-happs = {};
  };
}
