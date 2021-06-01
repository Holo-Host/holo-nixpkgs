{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-auto-installer;
in

{
  options.services.holo-auto-installer = {
    enable = mkEnableOption "holo-auto-installer";

    package = mkOption {
      default = pkgs.holo-auto-installer;
      type = types.package;
    };

    working-directory = mkOption {
      default = "";
    };
  };

  config = mkIf (cfg.enable) {
    systemd.services.holo-auto-installer = {
      after = [ "network.target" "configure-holochain.service" ];
      requisite = [ "configure-holochain.service" ];
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "holo_auto_installer=debug";
      environment.PUBKEY_PATH = "${cfg.working-directory}/agent_key.pub";
      path = with pkgs; [ unzip ];

      serviceConfig = {
        User = "holo-auto-installer";
        Group = "holo-auto-installer";
        ExecStart = "${cfg.package}/bin/holo-auto-installer ${cfg.working-directory}/config.yaml ${cfg.working-directory}/membrane-proofs.yaml";
        StateDirectory = "holo-auto-installer";
        Type = "oneshot";
       };
      };

      systemd.timers.holo-auto-installer = {
        enable = true;
        wantedBy = [ "multi-user.target" ];
        timerConfig = {
          OnUnitActiveSec = "5min"; # run every 5 min
          OnBootSec = "2min"; # first run 2 min after boot
          Unit = "holo-auto-installer.service";
        };
     };

    users.users.holo-auto-installer = {
      isSystemUser = true;
      createHome = false;
    };

    users.groups.holo-auto-installer = {};
  };
}
