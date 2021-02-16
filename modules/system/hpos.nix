{ lib, ... }:

with lib;

{
  options.system.hpos = {
    network = mkOption {};

    target = mkOption {
      default = "generic";
    };
  };
}