{ config, lib, makeTest }:
makeTest {
  name = "profile-demo";

  machine = {
    imports = [ (import ../../profiles/holoportos/demo) ];
  };

  testScript = ''
    startAll;
    $machine->succeed("ls -la /root");
    $machine->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
