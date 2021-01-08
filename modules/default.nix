{ lib, ... }:

{
  disabledModules = [
    "system/boot/loader/generic-extlinux-compatible"
  ];

  imports = [
    ./profiles/development.nix
    ./boot/generic-extlinux-compatible.nix
    ./profiles/hpos-admin-features.nix
    ./services/aorura-emu.nix
    ./services/automount.nix
    ./services/holo-auth-client.nix
    ./services/holo-router-agent.nix
    ./services/holo-router-gateway.nix
    ./services/holochain.nix
    ./services/hp-admin-crypto-server.nix
    ./services/hpos-admin-api.nix
    ./services/hpos-holochain-api.nix    
    ./services/holo-envoy.nix
    ./services/hpos-init.nix
    ./services/hpos-led-manager.nix
    ./services/lair-keystore.nix
    ./services/configure-holochain.nix
    ./system/holo-nixpkgs/auto-upgrade.nix
    ./system/holo-nixpkgs/usb-reset.nix
    ./system/holo-nixpkgs/install.nix
    ./system/hpos.nix
  ];

  # Compat shim, to be removed along with /profiles/targets:
  options.system.holoportos.network = lib.mkOption {};
}
