{ config, pkgs, ... }:

let
  wasabiBucket = "cache.holo.host";
  wasabiEndpoint = "s3.wasabisys.com";
in

{
  imports = [
    ../.
    ../master.nix
  ];

  nix.buildMachines = [
    {
      hostName = "localhost";
      maxJobs = config.nix.maxJobs;
      supportedFeatures = [
        "benchmark"
        "big-parallel"
        "kvm"
        "nixos-test"
      ];
      system = "x86_64-linux";
    }
    {
      hostName = "hydra-minion-1.holo.host";
      maxJobs = 96;
      sshKey = "/var/lib/hydra/queue-runner/.ssh/id_ed25519";
      sshUser = "root";
      supportedFeatures = [
        "benchmark"
        "big-parallel"
        "kvm"
        "nixos-test"
      ];
      system = "aarch64-linux";
    }
    {
      hostName = "hydra-minion-2.holo.host";
      maxJobs = 12;
      sshKey = "/var/lib/hydra/queue-runner/.ssh/id_ed25519";
      sshUser = "administrator";
      supportedFeatures = [];
      system = "x86_64-darwin";
    }
  ];

  services.postgresql.extraConfig = ''
    max_connections = 1024
  '';

  services.hydra.extraConfig = ''
    binary_cache_public_uri = https://cache.holo.host
    evaluator_max_heap_size = ${toString (4 * 1024 * 1024 * 1024)}
    log_prefix = https://cache.holo.host/
    max_concurrent_evals = 12
    max_output_size = 17179869184
    server_store_uri = https://cache.holo.host?local-nar-cache=/var/cache/hydra/nar-cache
    store_uri = s3://${wasabiBucket}?endpoint=${wasabiEndpoint}&log-compression=br&ls-compression=br&parallel-compression=1&secret-key=/var/lib/hydra/queue-runner/keys/cache.holo.host-1/secret&write-nar-listing=1
    upload_logs_to_binary_cache = true

    <githubstatus>
      context = Hydra
      jobs = holo-nixpkgs:.*:holo-nixpkgs
      inputs = holo-nixpkgs
    </githubstatus>

    <githubstatus>
      context = Hydra
      jobs = holo-envoy:.*:holo-envoy
      inputs = holo-envoy
    </githubstatus>

    <githubstatus>
      context = Hydra
      jobs = hp-admin:.*:hp-admin
      inputs = hp-admin
    </githubstatus>
  '';

  services.nginx = {
    virtualHosts.hydra.serverName = "hydra.holo.host";

    # First HoloPort/HoloPort+ batch points to Hydra-based Nix channel on
    # holoportbuild.holo.host. This has to be left here forever for reverse-
    # compatibility reasons.
    virtualHosts.hydra-legacy = {
      enableACME = true;
      forceSSL = true;
      globalRedirect = "hydra.holo.host";
      serverName = "holoportbuild.holo.host";
    };

    virtualHosts.chaperone = {
      enableACME = true;
      forceSSL = true;
      root = pkgs.chaperone;
      serverName = "chaperone.holo.host";
    };

    virtualHosts.holofuel-demo = {
      enableACME = true;
      forceSSL = true;
      root = pkgs.holofuel-app;
      serverName = "holofuel-demo.holo.host";
    };

    virtualHosts.hpstatus = {
      enableACME = true;
      forceSSL = true;
      root = pkgs.hpstatus;
      serverName = "hpstatus.holo.host";
    };

    virtualHosts.quickstart = {
      enableACME = true;
      forceSSL = true;
      root = pkgs.hpos-state-gen-web;
      serverName = "quickstart.holo.host";
      extraConfig = ''
        types {
          application/javascript js;
          application/wasm wasm;
          image/png png;
          image/svg+xml svg;
          text/css css;
          text/html html;
        }
      '';
    };
  };

  systemd.tmpfiles.rules = [
    "d /var/cache/hydra           0755 hydra hydra -  -"
    "d /var/cache/hydra/nar-cache 0775 hydra hydra 1d -"
  ];
}
