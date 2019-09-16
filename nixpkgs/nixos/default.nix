let
  nixpkgs = import ../source.nix;
in

import "${nixpkgs}/nixos"
