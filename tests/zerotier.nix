{ pkgs ? import ../nixpkgs {} }:

with pkgs;
with import "${pkgs.path}/nixos/lib/testing.nix" { inherit pkgs system; };

makeTest {
  name = "zerotier";
  machine = {
    imports = [ (import ../profiles/holoportos/demo) ];
    virtualisation.memorySize = 2024;
  };

  testScript = ''
    startAll;
    $machine->waitForUnit("zerotierone.service");
    $machine->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
