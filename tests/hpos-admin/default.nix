{ makeTest, lib, hpos-admin-client, hpos-config-gen-cli }:

makeTest {
  name = "hpos-admin";

  machine = {
    imports = [ (import ../../profiles) ];

    documentation.enable = false;

    environment.systemPackages = [
      hpos-admin-client
      hpos-config-gen-cli
    ];

    services.hpos-admin.enable = true;

    services.nginx = {
      enable = true;
      virtualHosts.localhost = {
        locations."/".proxyPass = "http://unix:/run/hpos-admin.sock:/";
      };
    };

    systemd.services.hpos-admin.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    users.users.nginx.extraGroups = [ "hpos-admin-users" ];
  };

  testScript = ''
    start_all()

    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    )

    machine.systemctl("start hpos-admin.service")
    machine.wait_for_unit("hpos-admin.service")
    machine.wait_for_file("/run/hpos-admin.sock")

    machine.succeed(
        "hpos-admin-client --url=http://localhost put-settings example KbFzEiWEmM1ogbJbee2fkrA1"
    )

    expected_settings = (
        "{"
        "'admin': {'email': 'test\@holo.host', 'public_key': 'zQJsyuGmTKhMCJQvZZmXCwJ8/nbjSLF6cEe0vNOJqfM'}, "
        "'example': 'KbFzEiWEmM1ogbJbee2fkrA1'"
        "}"
    )

    actual_settings = machine.succeed(
        "hpos-admin-client --url=http://localhost get-settings"
    ).strip()

    assert actual_settings == expected_settings, "unexpected settings"
  '';

  meta.platforms = lib.platforms.linux;
}
