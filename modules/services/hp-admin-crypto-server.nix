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
      # Don't start until holo-keystore derived, Holo auth'ed and Zerotier online.
      requires = [ "holo-auth-client.service" ];
      after =    [ "holo-auth-client.service" ];
      wantedBy = [ "multi-user.target" ];
      path = [ pkgs.hpos-init ];

      script = ''
        HPOS_STATE_PATH=$(hpos-init) ${cfg.package}/bin/hp-admin-crypto-server
      '';

      serviceConfig.User = "root";
    };
  };
}
