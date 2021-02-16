#!@bash@/bin/bash

set -euxo pipefail
PATH=@path@:$PATH

function on_exit {
  # shellcheck disable=SC2181
  if (($?)); then
    echo 'installation failed'
  else
    echo 'installation successful'
  fi
}

trap on_exit EXIT

@prePhase@

nixos-generate-config --root /mnt
cat @configuration@ > /mnt/etc/nixos/configuration.nix

nixos-install --channel @channel@ --no-root-passwd \
  -I holo-nixpkgs=@channel@/holo-nixpkgs \
  -I nixpkgs=@channel@/holo-nixpkgs/nixpkgs \
  -I nixpkgs-overlays=@channel@/holo-nixpkgs/overlays
echo '@channelUrl@ holo-nixpkgs' > /mnt/run/.nix-channels

@postPhase@
