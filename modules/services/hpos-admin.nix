{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-admin;
in

{
  options.services.hpos-admin = {
    enable = mkEnableOption "HPOS Admin";

    package = mkOption {
      default = pkgs.hpos-admin;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hpos-admin = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-admin";
      };
    };

    users.groups.hpos-admin-users = {};
  };
}
