{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.sim2h-server;
in

{
  config = mkIf cfg.enable {
    systemd.services.sim2h-server = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/sim2h_server -p ${toString cfg.port}";
      };
    };
  };
}
