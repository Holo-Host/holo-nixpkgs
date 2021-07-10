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
      after = [ "network.target"];
      wantedBy = [ "multi-user.target" ];

      path = with pkgs; [ jq more ];
      
      preStart = ''
        rm -f ${holochain-home}/lair-keystore/pid
        echo "initializing keystore from config at $HPOS_CONFIG_PATH"
        sleep 1
        ${cfg.package}/bin/lair-keystore --load-ed25519-keypair-from-base64 $(jq .v2.encrypted_key $HPOS_CONFIG_PATH | sed 's/"//g') -d ${holochain-home}/lair-keystore
      ''; 
    
      serviceConfig = {
        User = "holochain-rsm";
        Group = "holochain-rsm";
        ExecStart = "${cfg.package}/bin/lair-keystore -d ${holochain-home}/lair-keystore";
        StateDirectory = "holochain-rsm";
        Restart = "always";
      };
    };

    users.groups.lair-keystore = {};
  };
}
