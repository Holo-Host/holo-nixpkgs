{ config, ... }:

let
  holoNetworks = import ./holo-networks.nix;

  networkName = config.system.holoNetwork;

  select = attrs: key:
    if attrs ? key then attrs.${key} else attrs.mainnet;
in

{
  holoNetwork = select holoNetworks networkName;
}