{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-led-manager;
in

{
  options.services.hpos-led-manager = {
    enable = mkEnableOption "HPOS LED Manager";

    devicePath = mkOption {};

    package = mkOption {
      default = pkgs.hpos-led-manager;
      type = types.package;
    };

    statePath = mkOption {
      default = "/run/hpos-led-manager/state.json";
    };
  };

  config = mkIf cfg.enable {
    systemd.paths.hpos-led-manager = {
      wantedBy = [ "default.target" ];
      pathConfig.PathExists = cfg.devicePath;
    };

    systemd.services.hpos-led-manager = {
      path = [ pkgs.zerotierone ];
      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-led-manager --device ${cfg.devicePath} --state ${cfg.statePath}";
        ExecStopPost = "${pkgs.aorura}/bin/aorura-cli ${cfg.devicePath} --set flash:blue";
        RuntimeDirectory = "hpos-led-manager";
      };
    };
  };
}
