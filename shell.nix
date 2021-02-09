{ pkgs ? import ./. {} }:

with pkgs;

let
  root = toString ./.;

  extraSubstitutors = [
    "https://cache.holo.host"
  ];
  trustedPublicKeys = [
    "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
    "cache.holo.host-1:lNXIXtJgS9Iuw4Cu6X0HINLu9sTfcjEntnrgwMQIMcE="
    "cache.holo.host-2:ZJCkX3AUYZ8soxTLfTb60g+F3MkWD7hkH9y8CgqwhDQ="
  ];
in

mkShell {
  buildInputs = [ nixpkgs-fmt ];

  shellHook = ''
    holo-nixpkgs-fmt() {
      find ${root} -name \*.nix -exec nixpkgs-fmt {} +
    }

    hpos-shell() {
      local attr=$1
      [ -z "$attr" ] && attr="qemu"
      drv=$(nix-build ${root} --attr "hpos.$attr" --no-out-link --show-trace \
          --option extra-substituters "${builtins.concatStringsSep " " extraSubstitutors}" \
          --option trusted-public-keys  "${builtins.concatStringsSep " " trustedPublicKeys}" )
      [ -z "$drv" ] || "$drv/bin/run-hpos-vm"
    }

    hpos-switch() {
      sudo -E nixos-rebuild switch --fast -I nixos-config=/etc/nixos/configuration.nix
    }
  '';

  NIX_PATH = builtins.concatStringsSep ":" [
    "holo-nixpkgs=${root}"
    "nixpkgs=${pkgs.path}"
    "nixpkgs-overlays=${root}/overlays"
    "nixos-config=/etc/nixos/configuration.nix"
  ];
}
