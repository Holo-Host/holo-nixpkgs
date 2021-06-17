#!/bin/sh
# Simple shell script to get list of hosted happs

set -e

help () {
  echo "usage: holo <OPTIONS>"
  echo "  list-hosted-happs | l: List all the hosted happs registerd on HHA"
  echo "  help | h: display all usage options"
  exit 0
}

if [[ $# -eq 0 ]] ; then
  help
fi

echo 'Running holo-cli:' $1

case $1 in
    list-hosted-happs | l)
        hpos-holochain-client --url=http://localhost/holochain-api/ hosted-happs 1 DAY
    ;;
    help | h)
        help
    ;;
    *)
        echo "Invalid Option:" $1
    ;;
esac

exit 0
