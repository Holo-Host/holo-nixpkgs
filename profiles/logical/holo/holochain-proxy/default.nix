let
  settings = import ../../global-settings.nix { inherit config; };
in

{
  imports = [ ../. ];

  networking.hostName = "holochain-proxy";

  services.holochain-proxy = {
    enable = true;
    cert-file = settings.holoNetwork.proxy.certFile;
    working-directory = "/var/lib/holochain-proxy";
    port = settings.holoNetwork.proxy.port;
  };

  services.openssh.enable = true;

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    interval = "59min";
  };

  boot.cleanTmpDir = true;
}
