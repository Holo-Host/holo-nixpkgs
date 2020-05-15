{
  imports = [ ../. ];

  system.holo-nixpkgs.dev-settings.settings = {
    profiles.development.enable = true;
  };
}
