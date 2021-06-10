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

    flags = mkOption {
      default = "";
      type = types.str;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.trycp-server = {
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "info";

      path = [ pkgs.holochain pkgs.lair-keystore pkgs.lair-shim ];

      serviceConfig.ExecStart = "${cfg.package}/bin/trycp_server ${cfg.flags}";
      serviceConfig.LimitNOFILE = 524288;

      postStart = ''
        echo "ulimit -Sn"
      '';
    };
    
  };
}
