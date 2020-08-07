{ config, lib, pkgs, ... }:

with lib;

{
  systemd.services.nixos-rebuild = {
    serviceConfig.Type = "oneshot";
    unitConfig.X-StopOnRemoval = false;
    restartIfChanged = false;

    environment = config.nix.envVars // {
      inherit (config.environment.sessionVariables) NIX_PATH;
      HOME = "/root";
    } // config.networking.proxy.envVars;

    path = with pkgs; [ config.nix.package git gzip gnutar xz ];

    script = ''
      ${config.system.build.nixos-rebuild}/bin/nixos-rebuild switch
    '';
  };
}

