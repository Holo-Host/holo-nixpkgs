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
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos/config.json"
    )

    // wait for configure-holochain
    machine.wait_for_unit("configure-holochain.service")
    machine.wait_for_open_port("42233")

    // check if happ installed
    happs = machine.succeed("hc-state -a").strip()
    print(happs)

    // kill lair & wait for lair and hc
    lair = get_unit_info("lair-keystore")
    machine.succeed(make_command(["kill", "-9", lair["MainPID"]]))
    machine.wait_for_unit("lair-keystore.service")
    machine.wait_for_unit("holochain.service")

    // kill holo-envoy & wait for envoy and holochain
    envoy = get_unit_info("holo-envoy")
    machine.succeed(make_command(["kill", "-9", envoy["MainPID"]]))
    machine.wait_for_unit("holo-envoy.service")
    machine.wait_for_unit("holochain.service")

    // kill holochain & wait for holochain
    holochain = get_unit_info("holochain")
    machine.succeed(make_command(["kill", "-9", holochain["MainPID"]]))
    machine.wait_for_unit("holochain.service")

    // Check if happs are the same
    happs2 = machine.succeed("hc-state -a").strip()
    print(happs2)

    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
