{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.match-service-api;
in

{
  options.services.match-service-api = {
    enable = mkEnableOption "HPOS Admin";

    package = mkOption {
      default = pkgs.match-service-api;
      type = types.package;
    };

    wsgiWorkers = mkOption {
      default = 2;
    }
  };

  config = mkIf cfg.enable {

    environment.systemPackages = [ flask pandas pymongo ];

    systemd.services.match-service-api = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "
          ${pkgs.python3Packages.gunicorn}/bin/gunicorn ${cfg.package}.wsgi:app \
          --workers ${toString cfg.wsgiWorkers} \
          --bind unix:/run/match-api-server.sock
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