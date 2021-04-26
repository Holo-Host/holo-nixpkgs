{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.system.holo-nixpkgs.autoUpgrade;
in

{
  options = {
    system.holo-nixpkgs.autoUpgrade = {
      enable = mkEnableOption "Holo Nixpkgs auto-upgrade";

      interval = mkOption {
        description = ''
          Update interval in systemd.time(7) units.
        '';
        example = "1 h";
        default = "15min";
        type = types.str;
      };
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-nixpkgs-auto-upgrade = {
      serviceConfig.Type = "oneshot";
      unitConfig.X-StopOnRemoval = false;
      restartIfChanged = false;

      environment = config.nix.envVars // {
        inherit (config.environment.sessionVariables) NIX_PATH;
        HOME = "/root";
      } // config.networking.proxy.envVars;

      path = with pkgs; [ config.nix.package git gzip gnutar xz curl jq perl ];

      script = ''
        ${config.nix.package.out}/bin/nix-channel --update
        channel_name=$(${config.nix.package.out}/bin/nix-channel --list | cut -d '/' -f 7)
        curl -L -H Content-Type:application/json https://hydra.holo.host/jobset/holo-nixpkgs/$channel_name/latest-eval | jq -r '.jobsetevalinputs | ."holo-nixpkgs" | .revision' | perl -pe 'chomp' > /run/.nix-revision
        ${config.system.build.nixos-rebuild}/bin/nixos-rebuild switch
      '';
    };

    systemd.timers.auto-upgrade = {
      enable = true;
      wantedBy = [ "multi-user.target" ];

      timerConfig = {
        OnUnitActiveSec = cfg.interval;
        OnBootSec = "10sec";
        Unit = "holo-nixpkgs-auto-upgrade.service";
      };
    };
  };
}
