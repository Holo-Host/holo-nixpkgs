{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-auto-pilot;
in

{
  options.services.holo-auto-pilot = {
    enable = mkEnableOption "holo-auto-pilot";

    install-list = mkOption {
      type = types.attrs;
    };

    membrane-proofs = mkOption {
      type = types.attrs;
    };

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
      after = [ "network.target" "holochain.service" "hpos-holochain-api.service" "configure-holochain.service" ];
      requisite = [ "holochain.service" "hpos-holochain-api.service" "configure-holochain.service" ];
      wantedBy = [ "multi-user.target" ];

      environment.RUST_LOG = "holo_auto_pilot=debug";
      environment.PUBKEY_PATH = "${cfg.working-directory}/agent_key.pub";
      path = with pkgs; [ unzip ];

      preStart = ''
        sleep 2 # wait for configure-holochain to build config files
      '';

      serviceConfig = {
        User = "holo-auto-pilot";
        Group = "holo-auto-pilot";
        ExecStart = "${cfg.package}/bin/holo-auto-pilot ${cfg.working-directory}/config.yaml ${cfg.working-directory}/membrane-proofs.yaml";
        RemainAfterExit = true;
        StateDirectory = "holo-auto-pilot";
        Type = "oneshot"; # This should be updated to run every 5 mins
      };
    };

    users.users.holo-auto-pilot = {
      isSystemUser = true;
      createHome = false;
    };

    users.groups.holo-auto-pilot = {};
  };
}
