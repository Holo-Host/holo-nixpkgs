{ lib, ... }:

with lib;

{
  options.system.holoNetwork = mkOption {
    default = "alphaNet";
    type = types.str;
    description = ''
      Holo network that system is participating in.
      Can be alphaNet, devNet or other custom network as long as
      its settings are defined in holo-networks.nix.
    '';
  };
}
