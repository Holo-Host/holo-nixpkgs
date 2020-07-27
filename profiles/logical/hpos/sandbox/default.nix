{ config, lib, pkgs, ... }:

with pkgs;

let

  conductorHome = "/var/lib/holochain-conductor";

  dnas = with dnaPackages; [
    # list self hosted DNAs here
    # happ-store
    # holo-hosting-app
    holofuel
    servicelogger
  ];

  dnaConfig = drv: {
    id = drv.name;
    file = "${drv}/${drv.name}.dna.json";
    hash = pkgs.dnaHash drv;
    holo-hosted = false;
  };

   hostedDnas = with dnaPackages; [
    # list holo hosted DNAs here
    {
      drv = holofuel;
      happ-url = "https://holofuel.holo.host";
      happ-title = "HoloFuel";
      happ-release-version = "v0.1";
      happ-publisher = "Holo Ltd";
      happ-publish-date = "2020/01/31";
    }
  ];

  hostedDnaConfig = dna: rec {
    id = pkgs.dnaHash dna.drv;
    file = "${dna.drv}/${dna.drv.name}.dna.json";
    hash = id;
    holo-hosted = true;
    happ-url = dna.happ-url;
    happ-title = dna.happ-title;
    happ-release-version = dna.happ-release-version;
    happ-publisher = dna.happ-publisher;
    happ-publish-date = dna.happ-publish-date;
  };

  instanceConfig = drv: {
    agent = "host-agent";
    dna = drv.name;
    id = drv.name;
    holo-hosted = false;
    storage = {
      path = "${conductorHome}/${pkgs.dnaHash drv}";
      type = "lmdb";
    };
  };

  serviceloggerInstanceConfig = dna: {
    agent = "host-agent";
    dna = "servicelogger";
    id = "${pkgs.dnaHash dna.drv}::servicelogger";
    storage = {
      path = "${conductorHome}/servicelogger/${pkgs.dnaHash dna.drv}";
      type = "lmdb";
    };
  };

  hostedInstanceConfig = dna: {
    agent = "host-agent";
    dna = pkgs.dnaHash dna.drv;
    id = "hha::agent::${pkgs.dnaHash dna.drv}";
    holo-hosted = true;
    storage = {
      path = "${conductorHome}/hosted_happs/${pkgs.dnaHash dna.drv}";
      type = "lmdb";
    };
  };

in

{
  imports = [ ../. ];

  services.holo-auth-client.enable = false;

  services.holo-router-agent.enable = false;

  services.hpos-init.enable = false;

  services.sim2h-server.enable = true;

  services.zerotierone.enable = false;

  system.holo-nixpkgs.autoUpgrade.enable = false;

  system.holo-nixpkgs.usbReset.enable = false;

  services.holochain-conductor = {
    enable = true;
    config = {
      agents = [
        {
          id = "host-agent";
          name = "Host Agent";
          keystore_file = "/tmp/holo-keystore";
          public_address = "$HOLO_KEYSTORE_HCID";
        }
      ];
      bridges = [];
      dnas = map dnaConfig dnas ++ map hostedDnaConfig hostedDnas;
      instances = map instanceConfig dnas ++ map serviceloggerInstanceConfig hostedDnas ++ map hostedInstanceConfig hostedDnas;
      network = {
        type = "sim2h";
        sim2h_url = "ws://public.sim2h.net:9000";
      };
      logger = {
        state_dump = false;
        type = "debug";
        /* rules = {
          rules= [
          {
            exclude= true;
            pattern= ".*parity.*";
          }
          {
            exclude= true;
            pattern= ".*mio.*";
          }
          {
            exclude= true;
            pattern= ".*tokio.*";
          }
          {
            exclude= true;
            pattern= ".*hyper.*";
          }
          {
            exclude= true;
            pattern= ".*rusoto_core.*";
          }
          {
            exclude= true;
            pattern= ".*want.*";
          }
          {
            exclude= true;
            pattern= ".*rpc.*";
          }
          ];
        }; */
      };
      persistence_dir = conductorHome;
      signing_service_uri = "http://localhost:9676";
      interfaces = [
        {
          id = "master-interface";
          admin = true;
          driver = {
            port = 42211;
            type = "websocket";
          };
        }
        {
          id = "internal-interface";
          admin = false;
          driver = {
            port = 42222;
            type = "websocket";
          };
          instances = map (dna: { id =  pkgs.dnaHash dna.drv+"::servicelogger"; }) hostedDnas;
        }
        {
          id = "admin-interface";
          admin = false;
          driver = {
            port = 42233;
            type = "websocket";
          };
          instances = map (drv: { id = drv.name; }) dnas;
        }
        {
          id = "hosted-interface";
          admin = false;
          driver = {
            port = 42244;
            type = "websocket";
          };
          instances = map (dna: { id =  "hha::agent::"+pkgs.dnaHash dna.drv; }) hostedDnas;
        }
      ];
    };
  };


}
