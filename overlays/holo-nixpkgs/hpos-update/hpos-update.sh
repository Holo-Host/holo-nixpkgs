#!/bin/sh
# Simple shell script for switching nix channel and running a manual update
# type hpos-update for help
##

set -e

if [[ $# -eq 0 ]] ; then
    echo "usage: hpos-update [c]"
    echo "  c: channel name (e.g. master) or number (e.g 511)"
    exit 0
fi

echo 'Switching HoloPort to channel:' $1

case $1 in
    master)
        subdomain="hydra"
    ;;
    staging)
        subdomain="hydra"
    ;;
    *)
        subdomain="hydra"
    ;;
esac

nix-channel --add https://$subdomain.holo.host/channel/custom/holo-nixpkgs/$1/holo-nixpkgs
nix-channel --update

update=$(nixos-rebuild switch 2>&1 | tee /dev/stderr) # piping to stderr so it shows up in terminal

if echo $update | grep -q "using cached result"; then
    echo "Unable to update and using cached result"
    exit 1
else
    curl -L -H Content-Type:application/json https://hydra.holo.host/jobset/holo-nixpkgs/$1/latest-eval | jq -r '.jobsetevalinputs | ."holo-nixpkgs" | .revision' | perl -pe 'chomp' > /run/.nix-revision
    echo 'Successfully updated HoloPort to channel:' $1
fi

exit 0
