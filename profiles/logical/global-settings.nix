let
  holoNetworks = import ./holo-networks.nix;

  select = attrs: key:
    if attrs ? key then attrs.${key} else attrs.mainnet;
in

{
  holoNetwork = select holoNetworks system.holoNetwork;
}