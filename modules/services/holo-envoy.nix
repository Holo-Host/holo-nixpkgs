{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.holo-envoy;
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
      after = [ "network.target" "holochain-conductor.service" ];
      path = [ config.services.holochain-conductor.package ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = {
        ExecStart = "${pkgs.nodejs-12_x}/bin/node ${cfg.package}/lib/index.js";
      };
    };
  };
}
