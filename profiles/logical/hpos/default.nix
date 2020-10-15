{ config, lib, pkgs, ... }:

with pkgs;

let
  holo-router-acme = writeShellScriptBin "holo-router-acme" ''
    base36_id=$(${hpos-config-into-base36-id}/bin/hpos-config-into-base36-id < "$HPOS_CONFIG_PATH")
    until $(${curl}/bin/curl --fail --head --insecure --max-time 10 --output /dev/null --silent "https://$base36_id.holohost.net"); do
      sleep 5
    done
    exec ${simp_le}/bin/simp_le \
      --default_root ${config.security.acme.certs.default.webroot} \
      --valid_min ${toString config.security.acme.validMin} \
      -d "$base36_id.holohost.net" \
      -f fullchain.pem \
      -f full.pem \
      -f key.pem \
      -f account_key.json \
      -f account_reg.json \
      -v
  '';

  conductorHome = "/var/lib/holochain-conductor";

  hha-store = [
    {
      name = "hosted-holofuel";
      title = "HoloFuel";
      url = "http://holofuel.com";
      publisher = "Holo Ltd";
      versions = [
        {
          happ-id = "QmNs8vqa5dMwxXUStFPEjSj8LQ1vn7xkh1GPgEU5MCsubz";
          publish-date = "2020/08/19";
          dnas = {
            holofuel = {
              hash = "QmNedTibHaD3K7ojqa7ZZfkMBbUWg39taK6oLBEPAswTKu";
              url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha2/holofuel.dna.json";
              sha256 = "06bz94lg1is8lq2rrvwiqki0cm2fgnis9l223dq89wba2rmss75p";
            };
          };
        }
        {
          happ-id = "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK";
          publish-date = "2020/08/19";
          dnas = {
            holofuel = {
              hash = "QmWCuV9BptskAraBMidQHtre7hTqT1ouwqcFuh6Q7HbGGx";
              url = "https://holo-host.github.io/holofuel/releases/download/v0.21.6-alpha1/holofuel.dna.json";
              sha256 = "10i6a0kzd0xagq9fdica87jh0xm70i369bph7mr36sk248yl9h8w";
            };
          };
        }
      ];
    }
  ];

  installDNA = drv: runCommand (lib.removeSuffix ".dna.json" drv.name) {} ''
    install -Dm -x ${drv} $out/dna.json
  '';

  hha-fetched = map (
    app: {
      name = app.title;
      versions = map (
        version: {
          happ-id = version.happ-id;
          dnas = builtins.listToAttrs (
            map (
              name: {
                name = name;
                value = {
                  dna = installDNA (
                    fetchurl {
                      url = version.dnas.${name}.url;
                      sha256 = version.dnas.${name}.sha256;
                    }
                  ) + "/dna.json";
                  hash = version.dnas.${name}.hash;
                };
              }
            ) (builtins.attrNames version.dnas)
          );
        }
      ) app.versions;
    }
  ) hha-store;

  hosted-dnas = builtins.concatLists (map (
    app: builtins.concatLists (map (
      version: map (
        name: {
          id = version.dnas.${name}.hash;
          file = installDNA (
            fetchurl {
              url = version.dnas.${name}.url;
              sha256 = version.dnas.${name}.sha256;
            }
          ) + "/dna.json";
          hash = version.dnas.${name}.hash;
        }
      ) (builtins.attrNames version.dnas)
    ) app.versions)
  ) hha-store);

  service-logger-instances = builtins.concatLists (map (
    app: map (
      version: {
        id = "${version.happ-id}::servicelogger";
        dna = dnaPackages.servicelogger.name;
        agent = "host-agent";
        holo-hosted = false;
        storage = {
          path = "${conductorHome}/${version.happ-id}::servicelogger";
          type = "lmdb";
        };
      }
    ) app.versions
  ) hha-store);

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
in

{
  imports = [
    ../.
    ../binary-cache.nix
    ../self-aware.nix
    ../zerotier.nix
  ];

  boot.loader.grub.splashImage = ./splash.png;
  boot.loader.timeout = 1;

  environment.noXlibs = true;

  environment.systemPackages = [ hpos-reset bump-dna-cli hpos-admin-client hpos-update-cli git ];

  networking.firewall.allowedTCPPorts = [ 443 ];

  networking.hostName = lib.mkOverride 1100 "hpos";

  nix.gc = {
    automatic = true;
    dates = "daily";
    options = "--delete-older-than 7d";
  };

  security.sudo.wheelNeedsPassword = false;

  services.holo-auth-client.enable = lib.mkDefault true;

  services.holo-envoy.enable = true;

  services.holo-router-agent.enable = lib.mkDefault true;

  services.hp-admin-crypto-server.enable = true;

  services.hpos-admin.enable = true;

  services.hpos-init.enable = lib.mkDefault true;

  services.mingetty.autologinUser = "root";

  services.nginx = {
    enable = true;

    virtualHosts.default = {
      enableACME = true;
      onlySSL = true;
      locations = {
        "/" = {
          alias = "${pkgs.hp-admin-ui}/";
          extraConfig = ''
            limit_req zone=zone1 burst=30;
          '';
        };

        "~ ^/admin(?:/.*)?$" = {
            extraConfig = ''
              rewrite ^/admin.*$ / last;
              return 404;
            '';
        };

        "~ ^/holofuel(?:/.*)?$" = {
            extraConfig = ''
              rewrite ^/holofuel.*$ / last;
              return 404;
            '';
        };

        "/api/v1/" = {
          proxyPass = "http://unix:/run/hpos-admin.sock:/";
          extraConfig = ''
            auth_request /auth/;
          '';
        };

        "/api/v1/ws/" = {
          proxyPass = "http://127.0.0.1:42233";
          proxyWebsockets = true;
          extraConfig = ''
            auth_request /auth/;
          '';
        };

        "/auth/" = {
          proxyPass = "http://127.0.0.1:2884";
          extraConfig = ''
            internal;
            proxy_set_header X-Original-URI $request_uri;
            proxy_set_header X-Original-Method $request_method;
            proxy_pass_request_body off;
            proxy_set_header Content-Length "";
          '';
        };

        "/hosting/" = {
          proxyPass = "http://127.0.0.1:4656";
          proxyWebsockets = true;
        };
      };
    };

    virtualHosts.localhost = {
        locations."/".proxyPass = "http://unix:/run/hpos-admin.sock:/";
      };

    appendHttpConfig = ''
      limit_req_zone $binary_remote_addr zone=zone1:1m rate=2r/s;
    '';
  };

  services.holochain-conductor = {
    enable = true;
    available-happs = hha-fetched;
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
      dnas = map dnaConfig dnas ++ hosted-dnas;
      instances = map instanceConfig dnas ++ service-logger-instances;
      network = {
        type = "sim2h";
        sim2h_url = "ws://public.sim2h.net:9000";
      };
      logger = {
        state_dump = false;
        type = "debug";
      };
      persistence_dir = conductorHome;
      signing_service_uri = "http://localhost:9676";
      encryption_service_uri = "http://localhost:9676";
      decryption_service_uri = "http://localhost:9676";
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
          instances = map (instance: {
            id = instance.id;
          }) service-logger-instances;
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
        }
      ];
    };
  };

  system.holo-nixpkgs.autoUpgrade = {
    enable = lib.mkDefault true;
    dates = "*:0/10";
  };

  system.holo-nixpkgs.usbReset = {
    enable = lib.mkDefault true;
    filename = "hpos-reset";
  };

  systemd.services.acme-default.serviceConfig.ExecStart =
    lib.mkForce "${holo-router-acme}/bin/holo-router-acme";

  system.stateVersion = "19.09";

  users.users.nginx.extraGroups = [ "hpos-admin-users" ];

  users.users.holo.isNormalUser = true;

  users.users.root.hashedPassword = "*";
}
