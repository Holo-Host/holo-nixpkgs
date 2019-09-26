{ config, pkgs, ... }:
let
  wrapSystemdScript = (
    program: ''
      source ${config.system.build.setEnvironment}
      exec ${program}
    ''
  );
in rec {
  environment.systemPackages = with pkgs; [
    udiskie
    udisks2
  ];
  services = {
    udisks2.enable  = true;
  };
  systemd.user.services = {
    udiskie = {
      description = "Mounts disks in userspace with udisks";
      serviceConfig = {
        Type    = "simple";
        Restart = "always";
      };
      script = wrapSystemdScript ''
        ${pkgs.udiskie}/bin/udiskie \
          -2                        \
          --automount               \
          --file-manager=""         \
	  --no-notify               \
      '';
      wantedBy = [ "default.target" ];
    };
  };
  users.extraUsers.user = {
    extraGroups = [
      "plugdev"
    ];
  };
  users.extraGroups.plugdev = { };
}
