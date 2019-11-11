{ lib, ... }:

with lib;

{
  imports = [
    (mkRemovedOptionModule [ "system" "holoportos" "network" ]
     "Holo ZeroTier networks were merged together as of 2019-11-11.")
  ];

  options.system.holoportos = {
    target = mkOption {
      default = "generic";
    };
  };
}
