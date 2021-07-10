{ makeTest, lib, hpos }:

makeTest {
  name = "systemd-resilience-test";

  machine.imports = [ (import "${hpos.logical}/sandbox/test") ];

  testScript = ''
    start_all()

    machine.succeed("mkdir /etc/hpos")
    machine.succeed("chgrp apis /etc/hpos")
    machine.succeed("chmod g+rwx /etc/hpos")
    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --registration-code : --seed-from ${./seed.txt} > /etc/hpos/config.json"
    )

    # wait for configure-holochain
    machine.wait_for_unit("configure-holochain.service")
    machine.wait_for_open_port("42233")

    # check if happ installed
    happs = machine.succeed("hc-state a")
    if "servicelogger" not in happs or "core-app" not in happs:
        raise Exception(
            "Can't find any installed core happs - configure holochain failure?"
        )

    # kill lair & wait for lair and hc
    lair = machine.get_unit_info("lair-keystore")
    machine.succeed(make_command(["kill", "-9", lair["MainPID"]]))
    machine.wait_for_unit("lair-keystore.service")
    machine.wait_for_unit("holochain.service")

    # kill holo-envoy & wait for envoy and holochain
    envoy = machine.get_unit_info("holo-envoy")
    machine.succeed(make_command(["kill", "-9", envoy["MainPID"]]))
    machine.wait_for_unit("holo-envoy.service")
    machine.wait_for_unit("holochain.service")

    # kill holochain & wait for holochain
    holochain = machine.get_unit_info("holochain")
    machine.succeed(make_command(["kill", "-9", holochain["MainPID"]]))
    machine.wait_for_unit("holochain.service")

    # Final checks
    machine.wait_for_open_port("42233")
    happs2 = machine.succeed("hc-state a")
    if "servicelogger" not in happs or "core-app" not in happs2:
        raise Exception(
            "Can't find any installed core happs - holochain restart changed something?"
        )

    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
