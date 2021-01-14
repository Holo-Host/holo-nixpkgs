{ config, pkgs, ... }:

let
  wasabiBucket = "cache.holo.host";
  wasabiEndpoint = "s3.wasabisys.com";
  # TODO: bring into proper hydra module
  signingKeyName = "cache.holo.host-2";
in

{
  imports = [ ../. ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];

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

  nix.distributedBuilds = true;

  nix.extraOptions = ''
    builders-use-substitutes = true
  '';

  services.postgresql.extraConfig = ''
    max_connections = 1024
  '';

  services.hydra = {
    enable = true;
    hydraURL = "https://${config.services.nginx.virtualHosts.hydra.serverName}";
    logo = ./logo.svg;
    notificationSender = "hydra@holo.host";
    useSubstitutes = true;
    extraConfig = ''
      binary_cache_public_uri = https://cache.holo.host
      evaluator_max_heap_size = ${toString (4 * 1024 * 1024 * 1024)}
      log_prefix = https://cache.holo.host/
      max_concurrent_evals = 3
      max_output_size = 17179869184
      server_store_uri = https://cache.holo.host?local-nar-cache=/var/cache/hydra/nar-cache
      store_uri = s3://${wasabiBucket}?endpoint=${wasabiEndpoint}&log-compression=br&ls-compression=br&parallel-compression=1&secret-key=/var/lib/hydra/queue-runner/keys/${signingKeyName}/secret&write-nar-listing=1
      upload_logs_to_binary_cache = true

      <githubstatus>
        context = Hydra
        jobs = holo-nixpkgs:.*:holo-nixpkgs
        inputs = holo-nixpkgs
      </githubstatus>

      <githubstatus>
        context = Hydra
        jobs = hp-admin:.*:hp-admin
        inputs = hp-admin
      </githubstatus>
    '';
  };

  services.nginx = {
    enable = true;

    virtualHosts.hydra = {
      enableACME = true;
      forceSSL = true;
      locations = {
        "/".proxyPass = "http://localhost:${toString config.services.hydra.port}";
        "/favicon.ico".root = ./favicon;
      };
      serverName = "hydra.holo.host";
    };

    # First HoloPort/HoloPort+ batch points to Hydra-based Nix channel on
    # holoportbuild.holo.host. This has to be left here forever for reverse-
    # compatibility reasons.
    virtualHosts.hydra-legacy = {
      enableACME = true;
      forceSSL = true;
      globalRedirect = "hydra.holo.host";
      serverName = "holoportbuild.holo.host";
    };
  };

  systemd.tmpfiles.rules = [
    "d /var/cache/hydra           0755 hydra hydra -  -"
    "d /var/cache/hydra/nar-cache 0775 hydra hydra 1d -"
  ];

  environment.systemPackages = [ pkgs.holo-hydra-restore ];
}
