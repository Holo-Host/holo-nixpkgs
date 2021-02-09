{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-admin-api;
in

{
  options.services.hpos-admin-api = {
    enable = mkEnableOption "HPOS Admin";

    package = mkOption {
      default = pkgs.hpos-admin-api;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hpos-admin-api = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-admin-api";
        User = "admin-api";
        Group = "apis";
        UMask = "0002";
      };
    };

    systemd.tmpfiles.rules = [
      "d /run/hpos-admin-api 0770 admin-api apis - -"
      "z /run/.nix-channels 0664 root apis - -"
      "z /run/.nix-revision 0664 root apis - -"
    ];

    users.users.admin-api = {
      isSystemUser = true;
      group = "apis";
    };
  };
}
