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

    working-directory = mkOption {
      type = types.path;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.zt-collector = {
      after = [ "network.target" ];
      startAt = "*:0/15";

      serviceConfig = {
        ExecStart = "${pkgs.matching-engine}/collector/poll_script.py";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
