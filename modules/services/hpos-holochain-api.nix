{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-holochain-api;
in

{
  options.services.hpos-holochain-api = {
    enable = mkEnableOption "Host Console Server";

    package = mkOption {
      default = pkgs.hpos-holochain-api;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hpos-holochain-api = {
      after = [ "network.target" "nginx.service" ];
      wantedBy = [ "multi-user.target" ];
      path = with pkgs; [ unzip ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-holochain-api";
        User = "hc-api";
        Group = "apis";
        UMask = "0002";
        Restart = "always";
      };
    };

    systemd.tmpfiles.rules = [
      "d /run/hpos-holochain-api 0770 hc-api apis - -"
    ];

    users.users.hc-api = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      group = "apis";
    };
  };
}
