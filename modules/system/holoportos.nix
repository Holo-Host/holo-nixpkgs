{ lib, ... }:

with lib;

{
  options.system.holoportos = {
    network = mkOption {};

    target = mkOption {
      default = "generic";
    };
  };
}
