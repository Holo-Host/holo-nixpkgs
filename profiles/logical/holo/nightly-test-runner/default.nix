{ pkgs, ... }:

with pkgs;

{
  imports = [
    ../.
  ];

  networking.firewall.allowedTCPPorts = [ 80 443 ];
  networking.firewall.allowPing = true;

  environment.systemPackages = [
    git
    node
    jq
  ];

  boot.cleanTmpDir = true;
}