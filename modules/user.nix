{ ... }:

{
  users.extraUsers.holoport = {
    isNormalUser = true;
    extraGroups = [ "wheel" "holochain" ];
  };
  users.extraUsers.manager = {
    isNormalUser = true;
    extraGroups = [ "manager" ];
  };
  services.mingetty.autologinUser = "holoport";
  security.sudo.wheelNeedsPassword = false;
  security.sudo.configFile =
    ''
      Defaults:root,%wheel env_keep+=LOCALE_ARCHIVE
      Defaults:root,%wheel env_keep+=NIX_PATH
      Defaults:root,%wheel env_keep+=TERMINFO_DIRS
      Defaults env_keep+=SSH_AUTH_SOCK
      Defaults lecture = never
      holoport ALL=(ALL) NOPASSWD: ALL, SETENV: ALL
    '';
  services.openssh.enable = true;
  services.openssh.authorizedKeysFiles = ["/home/manager/.ssh/support_key"];
}
