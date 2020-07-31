{ lib, makeTest, holo-cli, hpos, hpos-config-gen-cli, hpos-config-into-keystore, jq }:

makeTest {
  name = "holochain-conductor";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    environment.systemPackages = [
      holo-cli
      hpos-config-gen-cli
      hpos-config-into-keystore
      jq
    ];


    systemd.services.holochain-conductor.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    startAll;

    $machine->succeed(
      "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    );

    $machine->systemctl("restart holochain-conductor.service");
    $machine->waitForUnit("holochain-conductor.service");
    $machine->waitForOpenPort("42211");

    my $expected_dnas = "holofuel\nservicelogger\n";
    my $actual_dnas = $machine->succeed(
      "holo admin --port 42211 interface | jq -r '.[2].instances[].id'"
    );

    die "unexpected dnas" unless $actual_dnas eq $expected_dnas;

    $machine->shutdown;
  '';

  meta.platforms = [ "x86_64-linux" ];
}
