{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-init;
in

{
  options.services.hpos-init = {
    enable = mkEnableOption "HPOS Init";

    configPath = mkOption {
      default = "/run/hpos-init/hpos-config.json";
    };

    package = mkOption {
      default = pkgs.hpos-init;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hpos-init = {
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      wantedBy = [ "multi-user.target" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-init";
        RemainAfterExit = true;
        RuntimeDirectory = "hpos-init";
        StateDirectory = "hpos-init";
        Type = "oneshot";
      };
    };

    systemd.services.acme-default = {
      after = [ "hpos-init.service" ];
      requires = [ "hpos-init.service" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;
    };

    systemd.services.holo-auth-client = {
      after = [ "hpos-init.service" ];
      requires = [ "hpos-init.service" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;
    };

    systemd.services.holo-router-agent = {
      after = [ "hpos-init.service" ];
      requires = [ "hpos-init.service" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;
    };

    systemd.services.holochain = {
      after = [ "hpos-init.service" ];
      requires = [ "hpos-init.service" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;
    };

    systemd.services.hp-admin-crypto-server = {
      after = [ "hpos-init.service" ];
      requires = [ "hpos-init.service" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;
    };

    systemd.services.hpos-admin-api = {
      after = [ "hpos-init.service" ];
      requires = [ "hpos-init.service" ];
      environment.HPOS_CONFIG_PATH = cfg.configPath;
    };
  };
}
