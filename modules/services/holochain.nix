{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holochain;
in

{
  options.services.holochain = {
    enable = mkEnableOption "Holochain";

    config = mkOption {
      type = types.attrs;
    };

    package = mkOption {
      default = pkgs.holochain;
      type = types.package;
    };

    working-directory = mkOption {
      type = types.path;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.holochain = {
      after = [ "network.target" "lair-keystore.service" "holo-envoy.service" ];
      requires = [ "lair-keystore.service" "holo-envoy.service" ];
      wantedBy = [ "multi-user.target" ];

      #environment.RUST_LOG = "debug";

      preStart = ''
        ${pkgs.envsubst}/bin/envsubst < ${pkgs.writeJSON cfg.config} > $STATE_DIRECTORY/holochain-config.yaml
        sleep .1 # wait for keystore socket to be ready
      '';

      serviceConfig = {
        User = "holochain-rsm";
        Group = "holochain-rsm";
        ExecStart = "${cfg.package}/bin/holochain -c ${cfg.working-directory}/holochain-config.yaml";
        StateDirectory = "holochain-rsm";
      };
    };

    users.users.holochain-rsm = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      # ensures directory is owned by user
      createHome = true;
    };

    users.groups.holochain-rsm = {};
  };
}
