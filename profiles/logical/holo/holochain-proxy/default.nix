{
  imports = [ ../. ];

  networking.hostName = "holochain-proxy";

  services.holochain-proxy.enable = {
    enable = true;
    cert-file = "proxy.cert";
    working-directory = "/var/lib/holochain-proxy";
    port = 5779;
  };

  services.openssh.enable = true;

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    dates = "*:0/59";
  };

  boot.cleanTmpDir = true;
}
