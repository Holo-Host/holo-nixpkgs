{
  disabledModules = [
    "system/boot/loader/generic-extlinux-compatible"
  ];

  imports = [
    ./boot/generic-extlinux-compatible.nix
    ./services/dnscrypt-proxy2.nix
    ./services/holo-envoy.nix
    ./services/hpos-admin.nix
    ./services/holochain-conductor.nix
    ./services/holo-router-agent.nix
    ./services/holo-router-gateway.nix
    ./system/holoportos.nix
    ./system/holoportos/auto-upgrade.nix
    ./system/holoportos/install.nix
    ./system/holoportos/led-daemon.nix
  ];
}
