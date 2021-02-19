{ pkgs, config, lib, ... }:

with lib;

let cfg = config.services.automount;

in {
  disabledModules = [ "services/misc/devmon.nix" ];

  options = {
    services.automount = {
      enable = mkEnableOption "automatic mounting of drives via devmon";

      execOnDrive = mkOption {
        description = ''
          A list of commands to run on mounted drives.

          You can use the following placeholders:
            %d    mount point directory (eg /media/cd)
            %f    device name (eg /dev/sdd1)
            %l    label of mounted volume
        '';
        example = [ "/path/to/script %d" ];
        default = [ ];
        type = with types; listOf str;
      };
    };
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [ udevil ];

    systemd.services.devmon = {
      description = "devmon automatic device mounting daemon";
      wantedBy = [ "default.target" ];
      path = with pkgs; [ udevil procps udisks2 which ];
      serviceConfig.ExecStart = let
        systemdEscape = command: builtins.replaceStrings [ "%" ] [ "%%" ] command;
        args = map (command: ''--exec-on-drive "${systemdEscape command}"'') cfg.execOnDrive;
      in toString ([ "${pkgs.udevil-patched}/bin/devmon" "--mount-options umask=0002,uid=root,gid=apis"] ++ args);
    };

    services.udisks2.enable = true;
  };
}
