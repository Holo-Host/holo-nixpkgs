{ config, lib, pkgs, ... }:

with pkgs;

let
  conductorHome = config.users.users.holochain-conductor.home;

  dnas = with dnaPackages; [
    happ-store
    holo-hosting-app
    holofuel
    servicelogger
  ];

  dnaConfig = drv: {
    id = drv.name;
    file = "${drv}/${drv.name}.dna.json";
    hash = pkgs.dnaHash drv;
  };

  instanceConfig = drv: {
    agent = "host-agent";
    dna = drv.name;
    id = drv.name;
    storage = {
      path = "${conductorHome}/${drv.name}";
      type = "file";
    };
  };
in

{
  imports = [ ../. ];

  environment.systemPackages = [];

  networking.firewall.allowedTCPPorts = [ 1111 2222 3333 8800 8880 8888 48080 ];

  services.holo-envoy.enable = true;

  services.holochain-conductor = {
    enable = true;
    config = {
      agents = [
        {
          id = "host-agent";
          name = "Host Agent";
          keystore_file = "${conductorHome}/holo-keystore";
          public_address = "@public_key@";
        }
      ];
      bridges = [];
      dnas = map dnaConfig dnas;
      instances = map instanceConfig dnas;
      network = {
        type = "sim2h";
        sim2h_url = "wss://sim2h.holochain.org:9000";
      };
      persistence_dir = conductorHome;
      signing_service_uri = "http://localhost:8888";
      interfaces = [
        {
          id = "master-interface";
          admin = true;
          driver = {
            port = 1111;
            type = "websocket";
          };
          instances = map (drv: { id = drv.name; }) dnas;
        }
        {
          id = "internal-interface-1";
          admin = false;
          driver = {
            port = 2222;
            type = "websocket";
          };
        }
        {
          id = "internal-interface-2";
          admin = false;
          driver = {
            port = 3333;
            type = "websocket";
          };
        }
      ];
    };
  };

  users.users.root.openssh.authorizedKeys.keys = lib.mkForce [
    # Matthew Brisebois
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGakK6G+lvSpg3NKfuWNopUlI/Z2keLGBH09jeAVbslO"
    # Paul B Hartzog
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH8w0/vpNXIRB/VPAnbE6RFWoL5DOlZ5x1KmCockehiE"
    # Perry Kundert
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILYMeKuFegEeM6L7/pJLSxgpyfrXXFOR1H/5C8liZWOL"
    # Sam Rose
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDZjtunUHW+Zd7UEzWQ2myqjgmIDTU+lo9lqhkhKW9LGY8yjcdhlgHwhmYUEWkmLbwrQz7vGzACFkhJ4R/2FHPleja+xrWebABWoabcPtFUrGUtSYZM0Ui2VYzhKX7Rxd4qbbF9bejdYeUMSox8RVuBlToyHC1+UgIpkfjm2Y7MTh46ILzpavWvSaHAhvcQi1qQ7kUaVGSdi3+wouMC8R6cjGo/7rCuobIH8cEA+L2IlMox8QE7gnBlP1YvFLSKGn65Jk1490uP7ZRpDphu8yy0mG4K4VjJ48k75L9gZPrFlF/1nRGELUBRdYAdoushYCMP/Kmg1yKsvRJt3UeOkbphiQLUNO3w2qSNiz+RMzM3HCtz2quENyD7UVVyF8kt5z5TMYjj847xCRJKUoDCzGAMCKm1hzrDMGARgpJDPNWSlXC+Hz3/LCwVZXiJy7xunAjJfRv/o4Oo3wbPm7u/AAP6+bIHsji9Nl4y3NuYJHZfs9DHTPONjyEorqLGfLqqzcD93OVo/f6tCMSC5gDyeLUT2/8UXTkMijPNOIJGnfLo6MjU1uGkhN64P1imm57qDILbpG71IJZZf7kX3K0EKPb82i5q5LYepLuWeYqmy+bOqyLBN1v8kFD/Pps4x7nCa4dviH4sy+lJslJizZP9ZFKg4jCVOfCK1zhycofYgKqlKQ=="
    # Yegor Timoshenko
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHLGgzH3ROvo65cnvkXmuz7Qc9bPvU+L2SrafQh0bMrK"
  ];
}
