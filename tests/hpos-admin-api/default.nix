{ makeTest, lib, hpos, hpos-admin-client, hpos-config, jq }:

makeTest {
  name = "hpos-admin-api";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    documentation.enable = false;

    environment.systemPackages = [
      hpos-admin-client
      hpos-config
      jq
    ];

    services.hpos-admin-api.enable = true;

    services.nginx = {
      enable = true;
      virtualHosts.localhost = {
        locations."/tests/".proxyPass = "http://unix:/run/hpos-admin-api/hpos-admin-api.sock:/";
      };
    };

    systemd.services.hpos-admin-api.environment.HPOS_CONFIG_PATH = "/etc/hpos/config.json";
    systemd.services.holochain.environment.HPOS_CONFIG_PATH = "/etc/hpos/config.json";

    users.users.nginx.extraGroups = [ "apis" ];

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    import json

    start_all()
    machine.succeed("mkdir /etc/hpos")
    machine.succeed("chgrp apis /etc/hpos")
    machine.succeed("chmod g+rwx /etc/hpos")

    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos/config.json"
    )
    machine.succeed("systemctl start hpos-admin-api.service")
    machine.wait_for_unit("hpos-admin-api.service")
    machine.wait_for_file("/run/hpos-admin-api/hpos-admin-api.sock")

    machine.succeed(
        "hpos-admin-client --url=http://localhost/tests/ put-settings example KbFzEiWEmM1ogbJbee2fkrA1"
    )
    expected_settings = {
        "admin": {
            "email": "test@holo.host",
            "public_key": "zQJsyuGmTKhMCJQvZZmXCwJ8/nbjSLF6cEe0vNOJqfM",
        },
        "example": "KbFzEiWEmM1ogbJbee2fkrA1",
    }
    actual_settings = json.loads(
        machine.succeed("hpos-admin-client --url=http://localhost/tests/ get-settings")
        .strip()
        .replace("'", '"')
    )
    assert actual_settings == expected_settings, "unexpected settings"

    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
