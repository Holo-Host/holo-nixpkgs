{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.match-service-api;
  python = pkgs.python3Packages.python;
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

    systemd.services.match-service-api = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      environment = let
        penv = python.buildEnv.override {
          extraLibs = with pkgs.python3Packages; [ flask pandas pymongo dnspython ];
        };
      in {
        PYTHONPATH= "${penv}/${python.sitePackages}/";
      };


      serviceConfig = {
        ExecStart = ''
          ${pkgs.python3Packages.gunicorn}/bin/gunicorn --pythonpath ${cfg.package} "server:create_app(config_filepath='${cfg.credentialsDir}/config.json')" --workers ${toString cfg.wsgiWorkers} --bind ${cfg.socket}
        '';
      };
    };
  };
}
