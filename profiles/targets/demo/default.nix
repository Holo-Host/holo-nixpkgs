{ config, pkgs, ... }:

with pkgs;

let
  conductorHome = config.users.users.holochain-conductor.home;

  hApps = with hAppPackages; [
    happ-store
    holo-hosting-app
    holofuel
    servicelogger
  ];

  dnaConfig = drv: {
    id = drv.name;
    file = "${drv}/${drv.name}.dna.json";
  };

  instanceConfig = drv: {
    agent = "host-agent";
    dna = drv.name;
    id = drv.name;
    storage = [{
      path = "${conductorHome}/${drv.name}";
      file = "file";
    }];
  };
in

{
  services.holochain-conductor = {
    enable = true;
    config = {
      bridges = [];
      dnas = map dnaConfig hApps;
      instances = map instanceConfig hApps;
      keystore_file = "${conductorHome}/holoportos-key";
      network = [
        { n3h_persistance_path = "${conductorHome}/n3h"; }
      ];
      persistence_dir = conductorHome;
      signing_service_uri = "http://localhost:8888";
      interfaces = [
        {
          id = "master-interface";
          admin = true;
          driver = [{
            port = "1111";
            type = "websocket";
          }];
          instances = map (drv: { id = drv.name; }) hApps;
        }
        {
          id = "internal-interface";
          admin = false;
          driver = [{
            port = "3333";
            type = "websocket";
          }];
        }
        {
          id = "internal-interface";
          admin = false;
          driver = [{
            port = 2222;
            type = "websocket";
          }];
        }
      ];
    };
  };

  imports = [ ../. ];

  users.users.root.openssh.authorizedKeys.keys = [
    # Yegor Timoshenko
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHLGgzH3ROvo65cnvkXmuz7Qc9bPvU+L2SrafQh0bMrK"
    # Matthew Brisebois
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGakK6G+lvSpg3NKfuWNopUlI/Z2keLGBH09jeAVbslO"
    # Perry Kundert
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILYMeKuFegEeM6L7/pJLSxgpyfrXXFOR1H/5C8liZWOL"
    # Paul B Hartzog
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCtDsXnWc7dpYMSdKeWMiC4I7ia5qpYQZwFiD+apSlaZz1ErrZ0jj8BGXAQOK+lncGDHt77Jyjd1IXU0gunPJWXAMiznXpmJuQ/tes3b/IN0ghGT3+KavjJV1H/d6TqyX2dmI0SNFkusWr7EYn70NqlIkoMqRVo3yhqm7F6UeFbVC7D/wrlCvo3BLTAD6hVMavEqL0PnH/gplqji3WY4sK/yp6tPfZE9Ig/2ahshkDUbsVG+ZC9U+nfVC/ZiQ/M8ImXN6j7AytBGxw8ffNbwk2Ltus2O90DWgxRbwtLNmRxaY3xdQm7Ir2CzwFPj0Ukndo9s5urdMpVjrabTAbNzA9ZTXEg9CMRjUHdr72SavgdUhqK64aENCnhdv18BBDhxkTL+Qp1CFfgsGo00ETUvR4/WIE29nwcooJjEw0darrwa4ZIZTS7/SLEcWECIi4G9d2bgRJHsZvO5RitA6pEuQbPOuhKhrveGsXu82jVlaB7ToVH2YJ/W1UhiKqwjVlISWukrTpO703bHSZV5D5rcHHTCBCGEkjhh79ZlWLnJyP8XET8F/umankOJX59qmcK4M+pZFQbTLHQ0fL0oNertXDTU7bY/8YnNsSCmbq1YS70U8qIHZtf3CI+K2QIGYYX/gsYb3xi5xAqVzLwF4dPVU5wMQWbzSHiqDacwX9u/9hlcw=="
  ];
}
