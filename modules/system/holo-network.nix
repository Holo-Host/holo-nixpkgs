{ lib, ... }:

with lib;

{
  options.system.holoNetwork = mkOption {
    default = "mainnet";
    type = types.str;
    description = ''
      Holo network that system is participating in.
      Can be mainnet, devnet or other custom network as long as
      its settings are defined in holo-networks.nix.
    '';
  };
}
