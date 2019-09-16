{ lib, makeTest }:

makeTest {
  name = "holo-envoy";

  machine = {
    imports = [ (import ../../profiles/holoportos/demo) ];
    virtualisation.memorySize = 2048;
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
    $machine->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
