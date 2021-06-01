{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-router-gateway;
in

{
  options.services.holo-router-gateway = {
    enable = mkEnableOption "Holo Router Gateway";

    package = mkOption {
      default = pkgs.holo-router;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-router-gateway = {
      after = [ "network.target" ];
      path = [ cfg.package ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/holo-router-gateway";
        KillMode = "process";
        LimitNOFILE = 65535;
        Restart = "always";
      };
    };
  };
}
