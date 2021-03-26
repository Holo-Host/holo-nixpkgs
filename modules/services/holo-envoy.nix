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
        Environment = "LOG_LEVEL=debug";
        ExecStart = "${cfg.package}/bin/holo-envoy";
      };

      postStart = ''
        START_LINE=$(journalctl -u holo-envoy -rn 50 | grep -n -m 1 "Starting holo-envoy.service" | cut -d : -f 1)
        COUNTER=600 # Give up after 1 minute
        until [ $COUNTER == 0 ] || [[ $(journalctl -u holo-envoy -rn $START_LINE | grep -qm 1 "Server has started on port:") ]]; do # wait for envoy to be ready
             sleep 0.1
             let COUNTER-=1
             START_LINE=$(journalctl -u holo-envoy -rn 50 | grep -n -m 1 "Starting holo-envoy.service" | cut -d : -f 1) 
         done
      '';
    };
  };
}
