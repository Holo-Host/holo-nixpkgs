{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.daily-uptime-calculator;
in

{
  options.services.daily-uptime-calculator = {
    enable = mkEnableOption "Daily Uptime Calculator";

    package = mkOption {
      default = pkgs.matching-engine;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.daily-uptime-calculator = {
      after = [ "network.target" ];
      startAt = "01:00";

      serviceConfig = {
        ExecStart = "${pkgs.matching-engine}/bin/matching-engine-stats ${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
