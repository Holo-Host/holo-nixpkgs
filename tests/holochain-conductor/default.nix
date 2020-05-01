{ lib, makeTestPython, holo-cli, hpos, hpos-config-gen-cli, hpos-config-into-keystore, jq }:

makeTestPython {
  name = "holochain-conductor";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    environment.systemPackages = [
      holo-cli
      hpos-config-gen-cli
      hpos-config-into-keystore
      jq
    ];

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    start_all()

    machine.succeed(
      "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    )

    machine.succeed(
      "hpos-config-into-keystore < /etc/hpos-config.json > /var/lib/holochain-conductor/holo-keystore 2> /var/lib/holochain-conductor/holo-keystore.pub"
    )

    machine.systemctl("restart holochain-conductor.service")
    machine.wait_for_unit("holochain-conductor.service")
    machine.wait_for_open_port("42211")

    expected_dnas = "happ-store\nholo-hosting-app\nholofuel\nservicelogger\n"
    actual_dnas = machine.succeed(
      "holo admin --port 42211 interface | jq -r '.[2].instances[].id'"
    )

    assert actual_dnas == expected_dnas, "unexpected dnas"
  '';

  meta.platforms = [ "x86_64-linux" ];
}
