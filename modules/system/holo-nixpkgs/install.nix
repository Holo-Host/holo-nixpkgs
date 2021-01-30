{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.system.hpos.install;

  inherit (config.system.hpos) target;
in

{
  options.system.hpos.install = {
    enable = mkEnableOption "HPOS installer";

    autorun = mkOption {
      default = true;
      type = types.bool;
    };

    autorunTty = mkOption {
      default = "/dev/tty1";
    };

    channel = mkOption {
      default = "master";
    };

    channelUrl = mkOption {
      default = "https://hydra.holo.host/channel/custom/holo-nixpkgs/${cfg.channel}/holo-nixpkgs";
    };

    package = mkOption {
      default = pkgs.hpos-install {
        inherit (cfg) channelUrl;
        inherit target;
      };

      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    environment.shellInit = lib.optionalString cfg.autorun ''
      if [ "$(tty)" = "${cfg.autorunTty}" ]; then
        ${cfg.package}/bin/hpos-install
      fi
    '';

    environment.systemPackages = [ cfg.package ];
  };
}
