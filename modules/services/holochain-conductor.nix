{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holochain-conductor;
in

{
  options.services.holochain-conductor = {
    enable = mkEnableOption "Holochain Conductor";

    config = mkOption {
      type = types.attrs;
    };

    package = mkOption {
      default = pkgs.holochain-rust;
      type = types.package;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.holochain-conductor = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        User = "holochain-conductor";
        Group = "holochain-conductor";
        StateDirectory = "holochain-conductor";
      };
    };

    users.users.holochain-conductor = {
      isSystemUser = true;
      home = "/var/lib/holochain-conductor";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.holochain-conductor = {};
  };
}
