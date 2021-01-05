{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.zt-collector;
in

{
  options.services.zt-collector = {
    enable = mkEnableOption "KV Uploader";

    package = mkOption {
      default = pkgs.matching-engine;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.zt-collector = {
      after = [ "network.target" ];
      startAt = "*:0/15";

      serviceConfig = {
        ExecStart = "${pkgs.matching-engine}/bin/matching-engine-collector ${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
