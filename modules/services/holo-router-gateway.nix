{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-router-gateway;
in

{
  options.services.holo-router-gateway = {
    enable = mkEnableOption "Holo Router Gateway";

    package = mkOption {
      default = pkgs.holo-router-gateway;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-router-gateway = {
      after = [ "network.target" ];
      path = [ config.services.holo-router-gateway.package ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/holo-router-gateway";
        KillMode = "process";
        Restart = "always";
      };
    };
  };
}
