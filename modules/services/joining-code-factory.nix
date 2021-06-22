{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.joining-code-factory;
in

{
  options.services.joining-code-factory = {
    enable = mkEnableOption "joining-code-factory";

    package = mkOption {
      default = pkgs.joining-code-factory;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };

    happName = mkOption {
      type = types.str;
    };

    appId = mkOption {
      type = types.str;
    };

    dnaNick = mkOption {
      type = types.str;
    };
  };

  config = mkIf (cfg.enable) {
    systemd.services.joining-code-factory = {
      after = [ "network.target" "holochain.service" "configure-holochain.service"];
      requisite = [ "holochain.service" ]; 
      startAt = "*:0/1";

      serviceConfig = {
        ExecStart = "${pkgs.joining-code-factory}/bin/service.js --config-path ${cfg.credentialsDir}/config.json --happ-name ${cfg.happName} --app-id ${cfg.appId} --dna-nick ${cfg.dnaNick}";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
