{ lib, makeTest, holo-cli, hpos, hpos-config, jq }:

makeTest {
  name = "holochain";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    environment.systemPackages = [
      hpos-config
      jq
    ];


    systemd.services.holochain.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    start_all()

    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    )

    machine.systemctl("restart holochain.service")
    machine.systemctl("start self-hosted-happs.service")
    machine.wait_for_open_port("42233")

    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
