{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-envoy;
  holochain-home = config.services.holochain.working-directory;
in

{
  options.services.holo-envoy = {
    enable = mkEnableOption "Holo Envoy";

    package = mkOption {
      default = pkgs.holo-envoy;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-envoy = {
      after = [ "network.target" "lair-keystore.service" ];
      requires = [ "lair-keystore.service" ];
      wantedBy = [ "multi-user.target" ];

      preStart = ''
        mkdir -p ${holochain-home}/lair-shim
        rm -rf ${holochain-home}/lair-shim/*
      '';

      serviceConfig = {
        Environment = "LOG_LEVEL=silly";
        ExecStart = "${cfg.package}/bin/holo-envoy";
      };
    };
  };
}
