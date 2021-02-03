{ lib, makeTest, holo-cli, hpos, hpos-config-gen-cli, jq }:

makeTest {
  name = "holochain-conductor";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    environment.systemPackages = [
      holo-cli
      hpos-config-gen-cli # TODO: now inside hpos-config package
      jq
    ];


    systemd.services.holochain-conductor.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    start_all()

    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    )

    machine.systemctl("restart holochain-conductor.service")
    machine.wait_for_unit("holochain-conductor.service")
    machine.wait_for_open_port("42211")

    expected_dnas = "holofuel\nservicelogger\n"
    actual_dnas = machine.succeed(
        "holo admin --port 42211 interface | jq -r '.[2].instances[].id'"
    )

    assert actual_dnas == expected_dnas, "unexpected dnas"

    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
