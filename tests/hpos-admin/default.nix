{ makeTest, lib, hpos, hpos-admin-client, hpos-config-gen-cli, hpos-config-into-keystore, jq }:

makeTest {
  name = "hpos-admin";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    documentation.enable = false;

    environment.systemPackages = [
      hpos-admin-client
      hpos-config-gen-cli
      hpos-config-into-keystore
      jq
    ];

    services.hpos-admin.enable = true;
    services.holochain-conductor.config.enable = true;

    services.nginx = {
      enable = true;
      virtualHosts.localhost = {
        locations."/".proxyPass = "http://unix:/run/hpos-admin.sock:/";
      };
    };

    systemd.services.hpos-admin.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";
    systemd.services.holochain-conductor.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    users.users.nginx.extraGroups = [ "hpos-admin-users" ];

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    startAll;

    $machine->succeed(
      "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    );

    $machine->succeed("rm -rf /var/lib/holochain-conductor/servicelogger");
    $machine->systemctl("restart holochain-conductor.service");
    $machine->waitForUnit("holochain-conductor.service");
    $machine->waitForOpenPort("42222");

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

    ## Testing hosted_happs api when there is not instances running (So the traffic happs should be 0)
    my $expected_file = "'file': '/var/lib/holochain-conductor/dnas/";
    my $expected_date = "'happ-publish-date': '2020/01/31'";
    my $expected_publisher = "'happ-publisher': 'Holo Ltd'";
    my $expected_url ="'happ-url': 'https://holofuel.holo.host'";
    my $expected_title = "'happ-title': 'HoloFuel'";
    my $expected_hosted = "'holo-hosted': True";
    my $expected_number_instances = "'number_instances': 1";
    my $expected_stats = "'stats': {'traffic': {'start_date': None, 'total_zome_calls': 0, 'value': []}";

    my $actual_hosted_happs = $machine->succeed("hpos-admin-client --url=http://localhost get-hosted-happs");
    chomp($actual_hosted_happs);

    print $actual_hosted_happs.hosted_happs;

    die "unexpected_hosted_happs_file" if (index($actual_hosted_happs, $expected_file) == -1);
    die "unexpected_hosted_happs_date" if (index($actual_hosted_happs, $expected_date) == -1);
    die "unexpected_hosted_happs_publisher" if (index($actual_hosted_happs, $expected_publisher) == -1);
    die "unexpected_hosted_happs_url" if (index($actual_hosted_happs, $expected_url) == -1);
    die "unexpected_hosted_happs_title" if (index($actual_hosted_happs, $expected_title) == -1);
    die "unexpected_hosted_happs_hosted" if (index($actual_hosted_happs, $expected_hosted) == -1);
    die "unexpected_hosted_happs_number_instances" if (index($actual_hosted_happs, $expected_number_instances) == -1);
    die "unexpected_hosted_happs_stats" if (index($actual_hosted_happs, $expected_stats) == -1);

    $machine->shutdown;

  '';

  meta.platforms = [ "x86_64-linux" ];
}
