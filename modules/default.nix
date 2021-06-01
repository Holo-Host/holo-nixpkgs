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
    ./services/hosted-happ-monitor.nix
    ./services/holochain-proxy.nix
    ./services/hp-admin-crypto-server.nix
    ./services/hpos-admin-api.nix
    ./services/hpos-holochain-api.nix
    ./services/holo-envoy.nix
    ./services/hpos-init.nix
    ./services/hpos-led-manager.nix
    ./services/kv-uploader.nix
    ./services/lair-keystore.nix
    ./services/configure-holochain.nix
    ./services/match-service-api.nix
    ./services/zt-collector.nix
    ./services/trycp-server.nix
    ./system/holo-nixpkgs/auto-upgrade.nix
    ./system/holo-nixpkgs/usb-reset.nix
    ./system/holo-nixpkgs/install.nix
    ./system/hpos.nix
  ];

  options.system.holoNetwork = lib.mkOption {
    default = "mainnet";
    type = types.str;
    description = ''
      Holo network that system is participating in.
      Can be mainnet, devnet or other custom network as long as
      its settings are defined in holo-networks.nix.
    '';
  };
}
