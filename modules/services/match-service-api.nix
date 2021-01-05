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

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf cfg.enable {

    environment.systemPackages = with pkgs.python3Packages; [ flask pandas pymongo ];

    systemd.services.match-service-api = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = ''
          ${pkgs.python3Packages.gunicorn}/bin/gunicorn '${cfg.package}.server:create_app(config_filepath=${cfg.credentialsDir}/config.json)'
          --workers ${toString cfg.wsgiWorkers}
          --bind ${cfg.socket}
        '';
      };
    };
  };
}