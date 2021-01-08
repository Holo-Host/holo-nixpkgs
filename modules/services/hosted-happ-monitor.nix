{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hosted-happs-monitor;
in

{
  options.services.hosted-happs-monitor = {
    enable = mkEnableOption "hosted-happs-monitor";

    package = mkOption {
      default = pkgs.hosted-happs-monitor;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package pkgs.nodejs ];

    systemd.services.hosted-happs-monitor = {
      after = [ "network.target" "holochain.service" "self-hosted-happs.service"];
      requisite = [ "holochain.service" ]; 
      startAt = "*:5/15";

      serviceConfig = {
        ExecStart = "${pkgs.nodejs}/bin/node --no-warnings ${cfg.package}/main.js --config-path=${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
