{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-auto-pilot;
in

{
  options.services.holo-auto-pilot = {
    enable = mkEnableOption "holo-auto-pilot";

    package = mkOption {
      default = pkgs.holo-auto-pilot;
      type = types.package;
    };

    working-directory = mkOption {
      default = "";
    };
  };

  config = mkIf (cfg.enable) {
    systemd.services.holo-auto-pilot = {
      after = [ "network.target" "configure-holochain.service" ];
      requisite = [ "configure-holochain.service" ];
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "holo_auto_pilot=debug";
      environment.PUBKEY_PATH = "${cfg.working-directory}/agent_key.pub";
      path = with pkgs; [ unzip ];

      serviceConfig = {
        User = "holo-auto-pilot";
        Group = "holo-auto-pilot";
        ExecStart = "${cfg.package}/bin/holo-auto-pilot ${cfg.working-directory}/config.yaml ${cfg.working-directory}/membrane-proofs.yaml";
        RemainAfterExit = true;
        StateDirectory = "holo-auto-pilot";
        Type = "oneshot";
       };

       systemd.timers.holo-auto-pilot = {
         enable = true;
         wantedBy = [ "multi-user.target" ];
         timerConfig = {
           OnUnitActiveSec = "5min"; # run every 5 min
           OnBootSec = "2min"; # first run 2 min after boot
           Unit = "holo-auto-pilot.service";
         };
       };
     };

    users.users.holo-auto-pilot = {
      isSystemUser = true;
      createHome = false;
    };

    users.groups.holo-auto-pilot = {};
  };
}
