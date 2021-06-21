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
      environment.HC_LMDB_SIZE = "1073741824";

      path = [ pkgs.holochain pkgs.lair-keystore ];

      serviceConfig.ExecStart = "${cfg.package}/bin/trycp_server";
      serviceConfig.LimitNOFILE = 524288;
    };
  };
}
