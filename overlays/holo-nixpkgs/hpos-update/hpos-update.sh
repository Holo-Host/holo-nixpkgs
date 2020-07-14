#!/bin/sh
# Simple shell script for switching nix channel and running a manual update
# type bump-dna for help
##

set -e

if [[ $# -eq 0 ]] ; then
    echo "usage: hpos-update [c]"
    echo "  c: channel name (e.g. master) or number (e.g 511)"
    exit 0
fi

echo 'Switching HoloPort to channel:' $1
nix-channel --add https://hydra.holo.host/channel/custom/holo-nixpkgs/$1/holo-nixpkgs
nix-channel --update

if [[ $? -ne 0 ]] ; then
    echo 'Error updating to channel:' $1
    exit 1
fi

curl -L -H Content-Type:application/json https://hydra.holo.host/jobset/holo-nixpkgs/$1/latest-eval | jq -r '.jobsetevalinputs | ."holo-nixpkgs" | .revision' | perl -pe 'chomp' > /root/.nix-revision
nixos-rebuild switch
echo 'Successfully updated HoloPort to channel:' $1

exit 0