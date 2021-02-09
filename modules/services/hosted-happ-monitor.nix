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
    environment.systemPackages = [ cfg.package pkgs.nodejs ];

    systemd.services.hosted-happ-monitor = {
      after = [ "network.target" "holochain.service" "configure-holochain.service"];
      requisite = [ "holochain.service" ]; 
      startAt = "*:5/15";

      serviceConfig = {
        ExecStart = "${pkgs.nodejs}/bin/node --no-warnings ${cfg.package}/bin/hosted-happ-monitor --config-path=${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
