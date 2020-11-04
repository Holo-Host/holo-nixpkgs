{ lib, ... }:

{
  imports = [
    ./services/aorura-emu.nix
    ./services/automount.nix
    ./services/holo-auth-client.nix
    ./services/holo-router-agent.nix
    ./services/holo-router-gateway.nix
    ./services/holochain-conductor.nix
    ./services/hp-admin-crypto-server.nix
    ./services/hpos-admin.nix
    ./services/hpos-init.nix
    ./services/hpos-led-manager.nix
    ./services/sim2h-server.nix
    ./system/holo-nixpkgs/auto-upgrade.nix
    ./system/holo-nixpkgs/usb-reset.nix
  ];

  # Compat shim, to be removed along with /profiles/targets:
  options.system.holoportos.network = lib.mkOption {};
}
