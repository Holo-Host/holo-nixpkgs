{
  imports = [ ../. ];

  networking.hostName = "holochain-proxy";

  services.holochain-proxy = {
    enable = true;
    cert-file = "proxy.cert";
    working-directory = "/var/lib/holochain-proxy";
    port = 5788;
  };

  services.openssh.enable = true;

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    interval = "59min";
  };

  boot.cleanTmpDir = true;
}
