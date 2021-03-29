{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.trycp-server;
in

{
  options.services.trycp-server = {
    enable = mkEnableOption "Trycp Server";

    package = mkOption {
      default = pkgs.tryorama;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.trycp-server = {
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "info";

      path = [ pkgs.holochain pkgs.lair-keystore ];

      serviceConfig.ExecStart = "${cfg.package}/bin/trycp_server -r 9100-9400";
    };
  };
}
