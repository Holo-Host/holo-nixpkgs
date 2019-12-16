{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hp-admin-crypto-server;
in

{
  options.services.hp-admin-crypto-server = {
    enable = mkEnableOption "HP Admin Crypto server";

    package = mkOption {
      default = pkgs.hp-admin-crypto-server;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.hp-admin-crypto-server = {
      wantedBy = [ "multi-user.target" ];
      path = [ pkgs.hpos-init ];

      script = ''
        HPOS_STATE_PATH=$(hpos-init) ${cfg.package}/bin/hp-admin-crypto-server
      '';

      serviceConfig.User = "root";
    };
  };
}
