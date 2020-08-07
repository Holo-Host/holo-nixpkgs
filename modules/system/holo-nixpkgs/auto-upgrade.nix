{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.system.holo-nixpkgs.autoUpgrade;
in

{
  options = {
    system.holo-nixpkgs.autoUpgrade = {
      enable = mkEnableOption "Holo Nixpkgs auto-upgrade";

      dates = mkOption {};
    };
  };

  config = mkIf cfg.enable {
    systemd.services.holo-nixpkgs-auto-upgrade = config.systemd.services.nixos-rebuild // {
      after = [ "network.target" ];

      path = with pkgs; [ config.nix.package git gzip gnutar xz curl jq perl ];

      script = ''
        ${config.nix.package.out}/bin/nix-channel --update
        channel_name=$(${config.nix.package.out}/bin/nix-channel --list | cut -d '/' -f 7)
        curl -L -H Content-Type:application/json https://hydra.holo.host/jobset/holo-nixpkgs/$channel_name/latest-eval | jq -r '.jobsetevalinputs | ."holo-nixpkgs" | .revision' | perl -pe 'chomp' > /root/.nix-revision
        ${config.system.build.nixos-rebuild}/bin/nixos-rebuild switch
      '';

      startAt = cfg.dates;
    };
  };
}
