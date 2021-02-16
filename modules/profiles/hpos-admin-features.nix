{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.hpos-admin-features;

in

{
  options.hpos-admin-features = {
    enable = mkOption {
      description = "Whether to enable toggling of HPOS features by HP Admin";
      type = types.bool;
      default = true;
    };

    tomlPath = mkOption {
      description = ''
        A path to a TOML file containing feature settings.

        Root of the TOML file should be a table with keys being
        names of the profiles, e.g. "development".

        Example:

        [development.features]
        ssh.enable = true
      '';
      type = types.path;
      default = /run/hpos-admin-api/hpos-admin-features.toml;
    };

  };

  config = mkIf cfg.enable {
    profiles = if (builtins.pathExists cfg.tomlPath) then
      builtins.fromTOML (builtins.readFile cfg.tomlPath)
      else {};
  };
}

