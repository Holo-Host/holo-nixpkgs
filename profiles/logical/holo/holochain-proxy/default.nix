{
  imports = [ ../. ];

  services.holochain-proxy.enable = {
    enable = true;
    cert-file = "proxy.cert";
    working-directory = "/var/lib/holochain-proxy";
    port = 5779;
  };

  system.defaultChannel = lib.mkDefault "https://hydra.holo.host/channel/custom/holo-nixpkgs/develop/holo-nixpkgs";

  networking.hostName = "holochain-proxy";

  services.openssh.enable = true;
}
