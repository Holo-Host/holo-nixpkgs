{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hp-admin-crypto-server;
in

{
  options.services.hp-admin-crypto-server = {
    enable = mkEnableOption "HP Admin Crypto server";

    package = mkOption {
      default = pkgs.hp-admin-crypto;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hp-admin-crypto-server = {
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "info";

      serviceConfig.ExecStart = "${cfg.package}/bin/hp-admin-crypto-server";
    };
  };
}
