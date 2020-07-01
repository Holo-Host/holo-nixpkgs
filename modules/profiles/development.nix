{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.profiles.development;

  sshOptions = {
    options = {
      enable = mkEnableOption "SSH to the Holoport";

      access = mkOption {
        description = "Control SSH access";
        type = types.submodule {
          options = {
            holoCentral = mkOption {
              description = "Whether to allow Holo Central team to access the Holoport";
              type = types.bool;
              default = true;
            };

            keys = mkOption {
              description = "Extra keys to be allowed to access the Holoport";
              type = with types; listOf str;
              default = [];
              example = [
                "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICp5OkzJW/6LQ1SYNTZC1hVg72/sca2uFOOqzZcORAHg"
              ];
            };
          };
        };
      };
    };
  };
in

{
  options.profiles.development = {
    enable = mkEnableOption "HPOS development profile";

    features = mkOption {
      description = "Feature flags to control the profile";
      type = types.submodule {
        options = {
          overrideConductorConfig = mkEnableOption "overriding conductor-config.toml and preventing updates to it";

          ssh = mkOption {
            description = "Flags to control SSH";
            type = types.submodule sshOptions;
          };
        };
      };
    };
  };

  config = mkIf cfg.enable (mkMerge [
    (mkIf cfg.features.overrideConductorConfig {
      environment.variables.HPOS_DEVELOPMENT_MODE = "true";
    })

    (with cfg.features.ssh; mkIf enable {
      services.openssh.enable = true;

      users.users.root.openssh.authorizedKeys = with access; {
        inherit keys;
        keyFiles = mkIf holoCentral [ ../staged/authorized_keys ];
      };
    })
  ]);
}
