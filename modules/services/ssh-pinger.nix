{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.ssh-pinger;
in

{
  options.services.ssh-pinger = {
    enable = mkEnableOption "test-hp-manager";

    package = mkOption {
      default = pkgs.test-hp-manager;
      type = types.package;
    };

    credentialsDir = mkOption {
      type = types.path;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package pkgs.nodejs ];

    systemd.services.ssh-pinger = {
      after = [ "network.target" "holochain.service" "configure-holochain.service"];
      requisite = [ "holochain.service" ]; 
      startAt = "*:5/120";
      
      serviceConfig = {
        ExecStart = "${pkgs.nodejs}/bin/node --no-warnings ${cfg.package}/bin/test-holoports-monitor --ssh-key-path=${cfg.credentialsDir}/id_rsa --config-path=${cfg.credentialsDir}/config.json";
        Type = "oneshot";
        User = "root";

      };
    };
  };
}
