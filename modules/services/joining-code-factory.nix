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
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package pkgs.nodejs ];

    systemd.services.joining-code-factory = {
      after = [ "network.target" "holochain.service" "configure-holochain.service"];
      requisite = [ "holochain.service" ]; 
      startAt = "*:0/1";

      serviceConfig = {
        ExecStart = "${pkgs.nodejs}/bin/node --no-warnings ${cfg.package}/bin/joining-code-factory";
        Type = "oneshot";
        User = "root";
      };
    };
  };
}
