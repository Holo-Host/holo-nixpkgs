{ makeTest, lib, hpos, hpos-holochain-client, hpos-config, jq }:

makeTest {
  name = "hpos-holochain-api";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    documentation.enable = false;

    environment.systemPackages = [
      hpos-holochain-client
      hpos-config
      jq
    ];

    services.hpos-holochain-api.enable = true;

    services.nginx = {
      enable = true;
      virtualHosts.localhost = {
        locations."/tests/".proxyPass = "http://unix:/run/hpos-holochain-api/hpos-holochain-api.sock:/";
      };
    };

    systemd.services.holochain.environment.HPOS_CONFIG_PATH = "/etc/hpos-config.json";

    users.users.nginx.extraGroups = [ "apis" ];

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    start_all()

    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos-config.json"
    )
    machine.succeed("systemctl restart holochain.service")
    machine.wait_for_unit("holochain.service")
    machine.wait_for_open_port("42233")

    machine.succeed("systemctl start hpos-holochain-api.service")
    machine.wait_for_unit("hpos-holochain-api.service")
    machine.wait_for_file("/run/hpos-holochain-api/hpos-holochain-api.sock")

    machine.wait_for_unit("configure-holochain.service")

    happs = machine.succeed("hc-state -d").strip()
    print(happs)

    list_of_happs = machine.succeed(
        "hpos-holochain-client --url=http://localhost/tests/ hosted-happs"
    ).strip()
    assert (
        "'name': 'Elemental Chat'" in list_of_happs
    ), "Failed to Get the list of hosted happs from hha"
    print(list_of_happs)
    """
    # The following tests only pass in a non sandbox environment
    happ_id = list_of_happs[9:62]
    print("Happ ID to install: ", happ_id)
    preferences = {
        "max_fuel_before_invoice": 10,
        "max_time_before_invoice": [86400, 0],
        "price_compute": 0.5,
        "price_storage": 1,
        "price_bandwidth": 0.5,
    }
    print("With preferences: ", preferences)
    installed_status = machine.succeed(
        f"hpos-holochain-client --url=http://localhost/tests/ install-hosted-happ {happ_id} 10 [86400,0] 0.5 1 0.5"
    ).strip()
    print("Installed status: ", installed_status)
    assert "200" in installed_status, "Failed to call /install_hosted_happ"

    happs = machine.succeed("hc-state -d").strip()
    print(happs)

    happsName = machine.succeed("hc-state -a").strip()
    print(happsName)

    # check if happ with happId is installed
    assert happ_id in happsName, "happ does not seem to be installed"

    # check if servicelogger instance for happId is installed
    slId = happ_id + "::servicelogger"
    assert slId in happsName, "happ does not seem to be installed"
    """
    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
/*

    installed_status = machine.succeed(
        "hpos-holochain-client --url=http://localhost/tests/ install-hosted-happ holohashinput"
    ).strip()

    print("INSTALLED STATUS: ", installed_status)

 */
