{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.match-service-api;
in

{
  options.services.match-service-api = {
    enable = mkEnableOption "Match Service API";

    package = mkOption {
      default = pkgs.match-service-api;
      type = types.package;
    };

    wsgiWorkers = mkOption {
      default = 2;
    };

    socket = mkOption {
      type = types.str;
    };
  };

  config = mkIf cfg.enable {

    environment.systemPackages = with pkgs.python3Packages; [ flask pandas pymongo ];

    systemd.services.match-service-api = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "
          ${pkgs.python3Packages.gunicorn}/bin/gunicorn ${cfg.package}.wsgi:app \
          --workers ${toString cfg.wsgiWorkers} \
          --bind ${cfg.socket}
        ";
        User = "admin-api";
        Group = "apis";
        UMask = "0002";
      };
    };

    users.users.admin-api = {
      isSystemUser = true;
      group = "apis";
    };
  };
}