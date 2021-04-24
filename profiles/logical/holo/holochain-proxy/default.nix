{
  imports = [ ../. ];

  networking.hostName = "holochain-proxy";

  services.holochain-proxy.enable = {
    enable = true;
    cert-file = "proxy.cert";
    working-directory = "/var/lib/holochain-proxy";
    port = 5779;
  };

  system.defaultChannel = lib.mkDefault "https://hydra.holo.host/channel/custom/holo-nixpkgs/develop/holo-nixpkgs";

  services.openssh.enable = true;

  system.holo-nixpkgs.autoUpgrade = {
    enable = true;
    dates = "*:0/59";
  };
}
