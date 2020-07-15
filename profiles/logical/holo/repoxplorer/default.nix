{ config, pkgs, lib, ... }:
let
  dataDir = "/var/lib/repoxplorer";
in
{
  imports = [ ../. ];

  networking.firewall.allowedTCPPorts = [ 80 ];

  systemd.tmpfiles.rules = [ "d ${dataDir} 440 root root" ];

  virtualisation.docker.enable = true;

  docker-containers."repoxplorer" = {
    image = "repoxplorer/repoxplorer";
    ports = [ "80:51000" ];
    volumes = [ "${dataDir}:/etc/repoxplorer/defs:z" ];
  };

  services.cron = {
    enable = true;
    systemCronJobs = [
      "5 * * * *  root  ${pkgs.docker}/bin/docker exec -i docker-repoxplorer.service repoxplorer-github-organization --org Holo-Host --skip-fork --output-path /etc/repoxplorer/defs/Holo-Host.yaml"
      "15 * * * *  root  ${pkgs.docker}/bin/docker exec -i docker-repoxplorer.service repoxplorer-github-organization --org holochain --skip-fork --output-path /etc/repoxplorer/defs/holochain.yaml"
    ];
  };
}
