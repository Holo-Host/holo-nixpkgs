{ lib, ... }:

with lib;

{
  options.system.hpos = {
    target = mkOption {
      default = "generic";
    };
  };
}