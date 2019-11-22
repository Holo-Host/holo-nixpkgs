{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.hpos-admin;
in

{
  options.services.hpos-admin = {
    enable = mkEnableOption "HPOS Admin";

    package = mkOption {
      default = pkgs.hpos-admin;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      hpos-state-gen-cli # for testing
    ];
    systemd.services.hpos-admin = {
      environment.HPOS_STATE_PATH = "/etc/hpos-state.json";
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-admin";
        User = "root"; # TODO: limit scope
      };
    };
  };
}
