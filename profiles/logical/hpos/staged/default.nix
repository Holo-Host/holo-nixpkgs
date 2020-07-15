# TODO: remove this around 2020-07-08 (#513)

{ lib }:

{
  imports = [ ../. ];

  # NOTE: uses /modules/profiles/development.nix
  profiles.development = {
    enable = lib.mkDefault true;
    features.ssh.enable = true;
  };
}
