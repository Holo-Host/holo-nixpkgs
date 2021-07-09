{ config, ... }:

let
  settings = import ../../global-settings.nix;

  networks = import ../../holo-networks.nix;

  holoNetwork = networks.selectNetwork config.system.holoNetwork;
in

{
  imports = [ ../. ];

  networking.hostName = "holochain-proxy";

  services.holochain-proxy = {
    enable = true;
    cert-file = holoNetwork.proxy.certFile;
    working-directory = "/var/lib/holochain-proxy";
    port = holoNetwork.proxy.port;
  };

  services.openssh.enable = true;

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    interval = "59min";
  };

  boot.cleanTmpDir = true;
}
