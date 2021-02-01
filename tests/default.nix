with pkgs;

let
in

{
  imports = [
    ./shared-machine.nix
    ./hpos-admin-api
    ./hpos-holochain-api
  ]

  hpos-shared-test = tests.shared-machine.test;
}
