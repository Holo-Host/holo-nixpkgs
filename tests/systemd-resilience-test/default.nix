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









    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
