{ config, lib, pkgs, ... }:

with pkgs;

let
  holochainWorkingDir = "/var/lib/holochain-rsm";
in

{
  imports = [ ../. ];

  services.holo-auth-client.enable = false;

  services.holo-router-agent.enable = false;

  services.hpos-init.enable = false;

  services.zerotierone.enable = false;

  system.holo-nixpkgs.autoUpgrade.enable = false;

  system.holo-nixpkgs.usbReset.enable = false;

  services.holochain = {
    enable = true;
    working-directory = holochainWorkingDir;
    config = {
      environment_path = "${holochainWorkingDir}/databases";
      use_dangerous_test_keystore = false;
      # signing_service_uri = "http://localhost:9676";
    };
  };

  services.lair-keystore.enable = true;
  
}
