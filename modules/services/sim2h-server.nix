{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.sim2h-server;
in

{
  options.services.sim2h-server = {
    enable = mkEnableOption "Holo Envoy";

    package = mkOption {
      default = pkgs.sim2h-server;
      type = types.package;
    };

    port = mkOption {
      default = 9000;
      type = types.int;
    };
  };

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
