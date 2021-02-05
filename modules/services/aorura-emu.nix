{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.aorura-emu;
in

{
  options.services.aorura-emu = {
    enable = mkEnableOption "AORURA Emulator";

    package = mkOption {
      default = pkgs.aorura;
      type = types.package;
    };

    path = mkOption {
      default = "/run/aorura-emu/server.pty";
    };
  };

  config = mkIf cfg.enable {
    systemd.services.aorura-emu = {
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        DynamicUser = true;
        ExecStart = "${pkgs.aorura}/bin/aorura-emu ${cfg.path}";
        PrivateDevices = true;
        RuntimeDirectory = "aorura-emu";
      };
    };
  };
}
