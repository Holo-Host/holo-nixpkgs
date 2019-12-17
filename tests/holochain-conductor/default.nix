{ lib, makeTest, holo-cli, hpos-state-gen-cli, hpos-state-derive-keystore, jq }:

makeTest {
  name = "holochain-conductor";

  machine = {
    imports = [ (import ../../profiles/holoportos/sandbox) ];

    environment.systemPackages = [
      holo-cli
      hpos-state-gen-cli
      hpos-state-derive-keystore
      jq
    ];

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    startAll;

    $machine->succeed(
      "hpos-state-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-state.json"
    );

    $machine->succeed(
      "hpos-state-derive-keystore < /etc/hpos-state.json > /var/lib/holochain-conductor/holo-keystore 2> /var/lib/holochain-conductor/holo-keystore.pub"
    );

    $machine->systemctl("restart holochain-conductor.service");
    $machine->waitForUnit("holochain-conductor.service");
    $machine->waitForOpenPort("42211");

    my $expected_dnas = "happ-store\nholo-hosting-app\nholofuel\nservicelogger\n";
    my $actual_dnas = $machine->succeed(
      "holo admin --port 42211 interface | jq -r '.[2].instances[].id'"
    );

    die "unexpected dnas" unless $actual_dnas eq $expected_dnas;

    $machine->shutdown;
  '';

  meta.platforms = [ "x86_64-linux" ];
}
