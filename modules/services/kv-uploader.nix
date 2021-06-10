{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.kv-uploader;
in

{
  options.services.kv-uploader = {
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
    systemd.services.kv-uploader = {
      after = [ "network.target" ];
      startAt = "*:5/15";

      serviceConfig = {
        ExecStart = "${pkgs.matching-engine}/bin/matching-engine-uploader ${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
