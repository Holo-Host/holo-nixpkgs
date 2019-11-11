{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.system.holoportos.install;

  inherit (config.system.holoportos) target;
in

{
  options.system.holoportos.install = {
    enable = mkEnableOption "HoloPortOS installer";

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
      default = pkgs.holoportos-install {
        auroraLedDevice = config.system.holoportos.led-daemon.device;
	inherit (cfg) channelUrl;
	inherit target;
      };

      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    environment.shellInit = lib.optionalString cfg.autorun ''
      if [ "$(tty)" = "${cfg.autorunTty}" ]; then
        ${cfg.package}/bin/holoportos-install
      fi
    '';

    environment.systemPackages = [ cfg.package ];
  };
}
