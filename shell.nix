{ pkgs ? import ./. {} }:

with pkgs;

let
  root = toString ./.;
in

stdenvNoCC.mkDerivation {
  name = "holo-nixpkgs";

  shellHook = ''
    holoportos-shell() {
      $(nix-build -I nixos-config=${root}/profiles/holoportos/$1 \
        --attr holoportos.qemu \
        --no-out-link)/bin/run-holoportos-vm
    }

    holoportos-switch() {
      sudo -E nixos-rebuild switch --fast -I nixos-config=/etc/nixos/configuration.nix
    }
  '';

  NIX_PATH = builtins.concatStringsSep ":" [
    "holo-nixpkgs=${root}"
    "nixpkgs=${pkgs.path}"
    "nixpkgs-overlays=${root}/overlays"
  ];
}
