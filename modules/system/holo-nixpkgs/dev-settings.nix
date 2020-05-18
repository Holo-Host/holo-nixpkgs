{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.system.holo-nixpkgs.dev-settings;
in

{
  options = {
    system.holo-nixpkgs.dev-settings = {
      enable = mkEnableOption "dev settings";

      settings = mkOption {
        default = {};
        example = {
          profiles.development = {
            enable = true;
            features = [ "ssh" ];
          };
        };
        type = types.attrs;
        description = "Settings to be written to /etc/dev-settings.toml.";
      };
    };
  };

  config = mkIf cfg.enable {
    environment.etc."dev-settings.toml".source = pkgs.writeTOML cfg.settings;
  };
}
