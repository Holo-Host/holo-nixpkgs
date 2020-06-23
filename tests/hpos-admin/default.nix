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
    startAll;

    $machine->succeed(
      "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    );

    $machine->systemctl("start hpos-admin.service");
    $machine->waitForUnit("hpos-admin.service");
    $machine->waitForFile("/run/hpos-admin.sock");

    $machine->succeed("hpos-admin-client --url=http://localhost put-settings example KbFzEiWEmM1ogbJbee2fkrA1");

    my $expected_settings = "{" .
      "'admin': {'email': 'test\@holo.host', 'public_key': 'zQJsyuGmTKhMCJQvZZmXCwJ8/nbjSLF6cEe0vNOJqfM'}, " .
      "'example': 'KbFzEiWEmM1ogbJbee2fkrA1'" .
    "}";

    my $actual_settings = $machine->succeed("hpos-admin-client --url=http://localhost get-settings");
    chomp($actual_settings);

    die "unexpected settings" unless $actual_settings eq $expected_settings;

    $machine->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
