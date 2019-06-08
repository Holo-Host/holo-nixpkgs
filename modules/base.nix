{ config, pkgs, lib, ... }:

with lib;
let
  cfg = config.holoport;
  pre-net-led = pkgs.callPackage ../packages/pre-net-led/pre-net-led.nix {};
  holo-led = pkgs.callPackage ../packages/holo-led/holo-led.nix {};
  shutdown-led = pkgs.callPackage ../packages/shutdown-led/shutdown-led.nix {};
  holo-health = pkgs.callPackage ../packages/holo-health/holo-health.nix {};
  holo-cli = pkgs.callPackage ../packages/holo-cli/default.nix {};
  envoy = pkgs.callPackage ../packages/envoy/default.nix {};
  fluentbit = pkgs.callPackage ../packages/fluentbit/default.nix {};
  n3h = pkgs.callPackage ../packages/n3h/default.nix {};
  hptest = pkgs.writeShellScriptBin "hptest" ''
    sudo lshw -C cpu >> hptest.txt
    sudo lshw -C memory >> hptest.txt
    sudo stress-ng --cpu 2 --io 3 --vm-bytes 1g --timeout 1m --hdd 4 --tz --verbose --verify --metrics-brief >> hptest.txt
    for hd in  /dev/disk/by-id/ata*; do
        if [[ $hd != *"-part"* ]];then
            sudo smartctl -i $hd >> hptest.txt
            r=$(sudo smartctl -t short -d ata $hd | awk '/Please wait/ {print $3}')
                        echo Check $hd - short test in $r minutes
                        [[ $r -gt $a ]] && a=$r
        fi
    done
    echo "Waiting $a minutes for all tests to complete"
                    sleep $(($a))m

            for hd in /dev/disk/by-id/ata*; do
            if [[ $hd != *"-part"* ]];then
                    smartctl -a $hd 2>&1 >> hptest.txt
            fi
            done




    for i in {1..10}; do
            sleep .01
            echo -n -e \\a
    done

    echo "All tests have completed"
    cat hptest.txt | less
    '';
  hpplustest = pkgs.writeShellScriptBin "hpplustest" ''
    sudo lshw -C cpu >> hpplustest.txt
    sudo lshw -C memory >> hpplustest.txt
    sudo stress-ng --cpu 4 --io 3 --vm-bytes 1g --timeout 1m --hdd 4 --tz --verbose --verify --metrics-brief >> hpplustest.txt
    for hd in  /dev/disk/by-id/ata*; do
        if [[ $hd != *"-part"* ]];then
            sudo smartctl -i $hd >> hpplustest.txt
            r=$(sudo smartctl -t short -d ata $hd | awk '/Please wait/ {print $3}')
                        echo Check $hd - short test in $r minutes
                        [[ $r -gt $a ]] && a=$r
        fi
    done
    echo "Waiting 5 minutes for all tests to complete"
                    sleep 5m

            for hd in /dev/disk/by-id/ata*; do
            if [[ $hd != *"-part"* ]];then
                    smartctl -a $hd 2>&1 >> hpplustest.txt
            fi
            done




    for i in {1..10}; do
            sleep .01
            echo -n -e \\a
    done

    echo "All tests have completed"
    cat hpplustest.txt | less
    '';
  systemd-activation = pkgs.writeShellScriptBin "systemd-activation" ''
    if [ ! -d /var/lib/holochain ] ;
    then mkdir /var/lib/holochain; chown -R holochain:holochain /var/lib/holochain;
    fi

    if [ ! -d /home/holochain/.n3h ] ;
    then mkdir /home/holochain/.n3h; chown -R holochain:holochain /home/holochain/.n3h;
    fi

    if [ ! -d /home/holochain/.config/holochain/keys ] ;
    then mkdir -p /home/holochain/.config/holochain/keys; chown -R holochain:holochain /home/holochain/.config/holochain/keys;
    fi


    if [ ! -f /var/lib/holochain/conductor-config.toml ];
    then cat <<- EOF > /var/lib/holochain/conductor-config.toml
    persistence_dir = "/var/lib/holochain"
    agents = []
    dnas = []
    instances = []
    interfaces = []
    bridges = []

    [logger]
    type = "debug"

    EOF
    fi
    chown holochain:holochain /var/lib/holochain/conductor-config.toml;
    chown -R holochain:holochain /var/lib/holochain;
    chmod 0775 /var/lib/holochain/conductor-config.toml;

  '';
in
{
  options = {
    holoport.modules = mkOption {
      internal = true;
      type = types.path;
      default = pkgs.holoportModules;
      description = ''
        Path to the current holoport checkout in the Nix store
      '';
    };

    holoport.channels.nixpkgs = mkOption {
      type = types.str;
      default = "http://holoportbuild.holo.host/job/holoportOs-testnet-dev-18_09/testnet-dev/channels.nixpkgs/latest/download/1";
      description = ''
        URL understood by Nix to a nixpkgs/NixOS channel
      '';
    };

    holoport.channels.holoport = mkOption {
      type = types.str;
      default = "http://holoportbuild.holo.host/job/holoportOs-testnet-dev-18_09/testnet-dev/channels.holoport-testnet/latest/download/1";
      description = ''
        URL understood by Nix to the Holoport channel
      '';
    };

    holoport.isInstallMedium = mkOption {
      type = types.bool;
      default = false;
    };
  };

  config = mkMerge [

    { nixpkgs.overlays = [ (import ../overlay.nix) ]; }

    (mkIf (!cfg.isInstallMedium) {
      boot.loader.grub.splashImage = ../artwork/holoport.jpg;
       swapDevices = [
        {
           device = "/var/swapfile";
           size = 2000; #MiB
        }
      ];
      boot.loader.grub.memtest86.enable = true;
      nix.nixPath = lib.mkForce [
        # The nixpkgs used for nixos-rebuild and all other nix commands
        "nixpkgs=${cfg.channels.nixpkgs}"

        # The custom configuration.nix that injects our modules
        "nixos-config=/etc/nixos/holoport-configuration.nix"
      ];
      users.users.holochain = {
        isNormalUser = true;
        description = "Holochain conductor service user";
        createHome = true;
        extraGroups = [ "holochain" ];
        uid = 401;
      };
      users.groups.holochain.gid = 501;
      # Caches tarballs obtained via fetchurl for 60 seconds, mainly
      # used for the channels
      nix.extraOptions = ''
        tarball-ttl = 60
      '';
      nixpkgs.config.allowUnfree = true;
      #environment.variables.PERSISTENCE_DIR = "/var/lib/holochain";
      #environment.variables.CONDUCTOR_CONFIG = "conductor-config.toml";
      environment.etc."nixos/holoport-configuration.nix" = {
        text = replaceStrings ["%%HOLOPORT_MODULES_PATH%%"] [pkgs.holoportModules]
          (readFile ../configuration.nix);
      };
      environment.variables.NIX_STORE = "/nix/store";
      #environment.variables.TMPDIR = "/home/holochain";
      environment.systemPackages = with pkgs; [
        binutils
        cmake
        emacs
        envoy
        fluentbit
        gcc
        holochain-conductor
        holochain-cli
        lshw
        n3h
        nodejs
        smartmontools
        stress-ng
        yarn
        zeromq4
      ];
      programs.bash.shellAliases = {
        htst = "${hptest}/bin/hptest";
        hptst = "${hpplustest}/bin/hpplustest";
        holo =  "/run/wrappers/bin/sudo ${holo-cli}/bin/holo-cli";
        n3h = "${n3h}/bin/n3h";
        holofuel-pkg = "${envoy}/bin/envoy/holofuel.dna.json";
        hha-pkg = "${envoy}/bin/envoy/HHA-dna-src.dna.json";
        has-pkg = "${envoy}/bin/envoy/HAS-dna-src.dna.json";
        has-ui = "${envoy}/bin/envoy/has-ui";
        hha-ui = "${envoy}/bin/envoy/hha-ui";
      };

      systemd.services.pre-net-led = {
        enable = true;
        wantedBy = [ "default.target" ];
        before = [ "network.target" ];
        description = "Turn on blinking purple until network is live";
        serviceConfig = {
          Type = "oneshot";
          User = "root";
          ExecStart = ''${pre-net-led}/bin/pre-net-led'';
          StandardOutput = "journal";
        };
      };
      systemd.services.holo-up = {
        enable = true;
        wantedBy = [ "default.target" ];
        after = [ "getty.target" ];
        description = "Turn on aurora when all systems go";
        serviceConfig = {
          Type = "oneshot";
          User = "root";
          ExecStart = ''${holo-led}/bin/holo-led'';
          StandardOutput = "journal";
        };
      };
      systemd.services.holo-shutdown = {
        enable = true;
        wantedBy = [ "multi-user.target" ];
        description = "Flash blue on any request for shutdown/poweroff/reboot";
        serviceConfig = {
          Type = "oneshot";
          User = "root";
          ExecStop = ''${shutdown-led}/bin/shutdown-led'';
          StandardOutput = "journal";
          RemainAfterExit = "yes";
        };
      };
      systemd.timers.holo-health = {
        description = "run holo-health every 30 seconds";
        wantedBy = [ "timers.target" ]; # enable it & auto start it

        timerConfig = {
          OnCalendar = "*:*:0/30";
        };
       };
      systemd.services.holo-health = {
        enable = true;
        serviceConfig = {
          Type = "oneshot";
          User = "root";
          ExecStart = ''${holo-health}/bin/holo-health'';
          StandardOutput = "journal";
        };
      };
      systemd.timers.systemd-activation = {
        description = "run systemd-activation every 30 seconds";
        wantedBy = [ "timers.target" ]; # enable it & auto start it

        timerConfig = {
          OnCalendar = "*:*:0/30";
        };
      };
      systemd.services.systemd-activation = {
        enable = true;
        serviceConfig = {
          Type = "oneshot";
          User = "root";
          ExecStart = '' ${systemd-activation}/bin/systemd-activation '';
          StandardOutput = "journal";
        };
      };
      #not used yet
      #services.osquery.enable = true;
      #services.osquery.loggerPath = "/var/log/osquery/logs";
      #services.osquery.pidfile = "/var/run/osqueryd.pid";
      networking.firewall.allowedTCPPorts = [ 1111 2222 3333 8800 8880 8888 48080 ];
      systemd.services.holochain = {
          description = "Holochain conductor service";
          after = [ "local-fs.target" "network.target" "systemd-activation.service" ];
          wantedBy = [ "multi-user.target" ];
          requires = [ "systemd-activation.service" ];
          environment = {
             NIX_STORE = "/nix/store";
             USER = "holochain";
          };
          serviceConfig = {
            ExecStart = ''/run/current-system/sw/bin/holochain -c /var/lib/holochain/conductor-config.toml'';
            Restart = "always";
            User = "holochain";
            StandardOutput = "journal";
            KillMode = "process";

          };
      };
      systemd.services.holochain.path = [ n3h ];
      systemd.services.envoy = {
          description = "envoy service";
          after = [ "local-fs.target" "network.target" "holochain.service" ];
          wantedBy = [ "multi-user.target" ];
          serviceConfig = {
            ExecStart = ''/run/current-system/sw/bin/node /run/current-system/sw/bin/envoy/lib/index.js'';
            Restart = "always";
            User = "holochain";
            StandardOutput = "journal";
            KillMode = "process";
          };
      };
      services.zerotierone = {
        enable = true;
        joinNetworks = ["93afae5963c547f1"];
      };


    })
  ];
}
