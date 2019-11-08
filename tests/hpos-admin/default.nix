{ lib, makeTest }:

makeTest {
  name = "hpos-admin";

  machine = {
    environment.systemPackages = with pkgs; [ hpos-state-gen-cli ];
    imports = [ (import ../../profiles/holoportos/demo) ];
    virtualisation.memorySize = 2048;
  };

  testScript = ''
    startAll;
    # TODO: Create deterministic config somewhere == HPOS_STATE_PATH
    $machine->succeed(
	"hpos-state-gen-cli --email a@b.ca --password password > /tmp/hpos-state.json"
    );
    $machine->systemctl("start hpos-admin.service");
    $machine->waitForUnit("hpos-admin.service");
    $machine->waitForOpenPort("5000");
    $machine->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
