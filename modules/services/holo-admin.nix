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

  # TODO: enable 'sudo nixos-rebuild ...' and 'sudo zerotier-cli -j info`
  # TODO: make "after" the systemd phase that locates the hpos-state.json file
  # TODO: set the HPOS_STATE_PATH environment variable
  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      hpos-state-gen-cli # for testing
    ];
    systemd.services.holo-admin = {
      environment.HPOS_STATE_PATH = "/tmp/hpos-state.json";
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/hpos-admin";
      };
    };
  };
}
