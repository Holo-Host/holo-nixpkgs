let
  nixpkgs = import ../src;
in

import "${nixpkgs}/nixos"
