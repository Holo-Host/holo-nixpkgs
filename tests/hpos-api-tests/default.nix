{ makeTest, lib, hpos, hpos-admin-client, hpos-holochain-client }:

let
  inherit (import ./admin-api-test.nix) admin-api-test;
  inherit (import ./holochain-api-test.nix) holochain-api-test;
in


makeTest {
  name = "hpos-admin-api";

  machine.imports = [ (import "${hpos.logical}/sandbox/test") ];

  testScript = ''
    import json

    start_all()

    machine.succeed("mkdir /etc/hpos")
    machine.succeed("chgrp apis /etc/hpos")
    machine.succeed("chmod g+rwx /etc/hpos")
    machine.succeed(
        "hpos-config-gen-cli --email test\@holo.host --password : --seed-from ${./seed.txt} > /etc/hpos/config.json"
    )

    ${admin-api-test}

    ${holochain-api-test}

    machine.shutdown()
  '';

  meta.platforms = [ "x86_64-linux" ];
}
