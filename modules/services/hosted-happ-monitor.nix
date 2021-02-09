{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hosted-happ-monitor;
in

{
  options.services.hosted-happ-monitor = {
    enable = mkEnableOption "hosted-happ-monitor";

    package = mkOption {
      default = pkgs.hosted-happ-monitor;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf (cfg.enable) {

    systemd.services.hosted-happ-monitor = {
      after = [ "network.target" "holochain.service" "configure-holochain.service"];
      requisite = [ "holochain.service" ]; 
      startAt = "*:5/15";

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hosted-happ-monitor --config-path=${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "hosted-happ-monitor";
        UMask = "0002";
      };
    };
    
    users.users.hosted-happ-monitor = {
      isSystemUser = true;
      home = "${cfg.credentialsDir}";
      # ensures directory is owned by user
      createHome = true;
    };

    systemd.tmpfiles.rules = [
      "d ${cfg.credentialsDir} 0755 hosted-happ-monitor - - -"
      "d /run/hosted-happ-monitor 0770 hosted-happ-monitor - - -"
    ];
  };
}
