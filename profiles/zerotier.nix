{ lib, ... }:

{
  services.zerotierone = {
    enable = lib.mkDefault true;
    joinNetworks = [ "93afae5963c547f1" ];
  };
}
