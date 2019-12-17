{
  disabledModules = [
    "system/boot/loader/generic-extlinux-compatible"
  ];

  imports = [
    ./boot/generic-extlinux-compatible.nix
    ./services/dnscrypt-proxy2.nix
    ./services/holo-auth-client.nix
    ./services/holo-envoy.nix
    ./services/holo-router-agent.nix
    ./services/holo-router-gateway.nix
    ./services/holochain-conductor.nix
    ./services/hp-admin-crypto-server.nix
    ./services/hpos-admin.nix
    ./services/sim2h-server.nix
    ./system/holoportos.nix
    ./system/holoportos/auto-upgrade.nix
    ./system/holoportos/install.nix
    ./system/holoportos/led-daemon.nix
  ];
}
