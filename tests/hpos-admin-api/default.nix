{ makeTest, lib, hpos, hpos-admin-client, hpos-config-gen-cli, jq }:

makeTest {
  name = "hpos-admin-api";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    documentation.enable = false;

    environment.systemPackages = [
      hpos-admin-client
      hpos-config-gen-cli  # TODO: now inside hpos-config package
      jq
    ];

    services.hpos-admin-api.enable = true;
    services.holochain-conductor.config.enable = true;

    services.nginx = {
      enable = true;
      virtualHosts.localhost = {
        locations."/".proxyPass = "http://unix:/run/hpos-admin-api/hpos-admin-api.sock:/";
      };
    };

    systemd.services.hpos-admin-api.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";
    systemd.services.holochain-conductor.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    users.users.nginx.extraGroups = [ "apis" ];

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    start_all()

    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from {./seed.txt} > /etc/hpos-config.json"
    )

    machine.succeed("rm -rf /var/lib/holochain-conductor/servicelogger")
    machine.succeed("systemctl restart holochain-conductor.service")
    machine.wait_for_unit("holochain-conductor.service")
    machine.wait_for_open_port("42222")

    machine.succeed("systemctl start hpos-admin-api.service")
    machine.wait_for_unit("hpos-admin-api.service")
    machine.wait_for_file("/run/hpos-admin-api/hpos-admin-api.sock")
    machine.succeed(
	"hpos-admin-client --url=http://localhost put-settings example KbFzEiWEmM1ogbJbee2fkrA1"
    )
    expected_settings = (
	"{"
        + "'admin': {'email': 'test\@holo.host', 'public_key': 'zQJsyuGmTKhMCJQvZZmXCwJ8/nbjSLF6cEe0vNOJqfM'}, "
        + "'example': 'KbFzEiWEmM1ogbJbee2fkrA1'"
        + "}"
    )
    actual_settings = machine.succeed("hpos-admin-client --url=http://localhost get-settings").strip()
    assert actual_settings == expected_settings, "unexpected settings"

    with subtest("Testing hosted_happs api when there is not instances running (So the traffic happs should be 0)"):
        expected_file = "'file': '/var/lib/holochain-conductor/dnas/"
        expected_date = "'happ-publish-date': '2020/01/31'"
        expected_publisher = "'happ-publisher': 'Holo Ltd'"
        expected_url ="'happ-url': 'https://holofuel.holo.host'"
        expected_title = "'happ-title': 'HoloFuel'"
        expected_hosted = "'holo-hosted': True"
        expected_number_instances = "'number_instances': 1"
        expected_stats = "'stats': {'traffic': {'start_date': None, 'total_zome_calls': 0, 'value': []}"

        actual_hosted_happs = machine.succeed("hpos-admin-client --url=http://localhost get-hosted-happs").strip()

        print(actual_hosted_happs.hosted_happs)

        assert expected_file in actual_hosted_happs, "unexpected_hosted_happs_file"
        assert expected_date in actual_hosted_happs, "unexpected_hosted_happs_date"
        assert expected_publisher in actual_hosted_happs, "unexpected_hosted_happs_publisher"
        assert expected_url in actual_hosted_happs, "unexpected_hosted_happs_url"
        assert expected_title in actual_hosted_happs, "unexpected_hosted_happs_title"
        assert expected_hosted in actual_hosted_happs, "unexpected_hosted_happs_hosted"
        assert expected_number_instances in actual_hosted_happs, "unexpected_hosted_happs_number_instances"
        assert expected_stats in actual_hosted_happs, "unexpected_hosted_happs_stats"

    machine.shutdown()

  '';

  meta.platforms = [ "x86_64-linux" ];
}
