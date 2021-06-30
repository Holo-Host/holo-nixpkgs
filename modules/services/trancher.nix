{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.trancher;
in

{
  options.services.trancher = {
    enable = mkEnableOption "trancher";

    package = mkOption {
      default = pkgs.matching-engine;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.trancher = {
      after = [ "network.target" ];
      startAt = "*:0/15";

      serviceConfig = {
        ExecStart = "${pkgs.matching-engine}/bin/matching-engine-trancher ${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
