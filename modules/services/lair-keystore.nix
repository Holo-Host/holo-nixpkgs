{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.lair-keystore;
  holochain-home = config.services.holochain.working-directory;
in

{
  options.services.lair-keystore = {
    enable = mkEnableOption "Lair Keystore";

    package = mkOption {
      default = pkgs.lair-keystore;
      type = types.package;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.lair-keystore = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      preStart = ''
        rm -f ${holochain-home}/lair-keystore/pid
      '';

      serviceConfig = {
        User = "holochain-rsm";
        Group = "holochain-rsm";
        ExecStart = "${cfg.package}/bin/lair-keystore -d ${holochain-home}/lair-keystore";
        StateDirectory = "holochain-rsm";
      };
    };

    users.groups.lair-keystore = {};
  };
}
