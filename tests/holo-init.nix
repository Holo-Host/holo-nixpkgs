{ pkgs ? import ../nixpkgs {} }:

with pkgs;
with import "${pkgs.path}/nixos/lib/testing.nix" { inherit pkgs system; };

makeTest {
  name = "holo-init";
  machine = {
    imports = [ (import ../profiles/holoportos/demo) ];
    virtualisation.memorySize = 2024;
  };

  testScript = ''
    startAll;
    $machine->succeed("holo-keygen /var/lib/holochain-conductor/holo");
    $machine->systemctl("restart holochain-conductor.service");
    $machine->systemctl("start holo-envoy.service");
    $machine->waitForUnit("holochain-conductor.service");
    $machine->waitForUnit("holo-envoy.service");
    $machine->waitForOpenPort("1111");
    $machine->waitForOpenPort("48080");
    $machine->waitForOpenPort("3333");
    $machine->waitForOpenPort("2222");
    $machine->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
