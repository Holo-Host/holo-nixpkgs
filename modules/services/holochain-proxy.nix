{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holochain-proxy;
in

{
  options.services.holochain-proxy = {
    enable = mkEnableOption "Holochain proxy";

    port = mkOption {
      type = types.int;
    };

    cert-file = mkOption {
      type = types.str;
    };

    working-directory = mkOption {
      type = types.path;
    };

    package = mkOption {
      default = pkgs.kitsune-p2p-proxy;
      type = types.package;
    };
  };

  config = mkIf (cfg.enable) {
    environment.systemPackages = [ cfg.package ];

    systemd.services.holochain-proxy = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      # environment.RUST_LOG = "debug";

      serviceConfig = {
        User = "holochain-proxy";
        Group = "holochain-proxy";
        ExecStart = "${cfg.package}/bin/kitsune-p2p-proxy -b kitsune-quic://0.0.0.0:${cfg.port} --danger-use-unenc-cert ${cfg.working-directory}/${cfg.cert-file}";
        Restart = "always";
        RestartSec = 1;
        Type = "exec";
      };
    };

    users.users.holochain-proxy = {
      isSystemUser = true;
      home = "${cfg.working-directory}";
      createHome = true;
    };

    users.groups.holochain-proxy = {};

    networking.firewall.allowedTCPPorts = [ cfg.port ];
  };
}
