{ config, lib, pkgs, ... }:

let
  channelsPath = "/nix/var/nix/profiles/per-user/root/channels";
in

{
  nix.nixPath = [
    "nixos-config=/etc/nixos/configuration.nix"
    "nixpkgs=${channelsPath}/holo-nixpkgs/nixpkgs"
    "nixpkgs-overlays=${channelsPath}/holo-nixpkgs/overlays"
    channelsPath
  ];

  system.activationScripts.nix = lib.mkForce (
    lib.stringAfter [ "etc" "users" ] ''
      ${config.nix.package}/bin/nix ping-store --no-net

      if [ ! -e /run/.nix-channels ]; then
        echo "${config.system.defaultChannel} holo-nixpkgs" > "/run/.nix-channels"
      fi
    ''
  );

  system.defaultChannel = lib.mkDefault "https://hydra.holo.host/channel/custom/holo-nixpkgs/master/holo-nixpkgs";
}
