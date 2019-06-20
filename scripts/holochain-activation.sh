#!/usr/bin/env bash

# 
# holochain-activation -- Activate the HoloPort for Holo / Holochain
#
# DESCRIPTION
# 
#     Perform any configurations required to make the HoloPortOS ready to run Holo / Holochain.
# Assumes that the basic HoloPortOS configuration is sane (see: holoport-preflight).
# 

# make_directory dir [user:group]
make_directory() {
    if [ ! -d "${1}" ]; then
	mkdir -p "${1}"
	[ -z "${2}" ] || chown -R "${2}" "${1}"
    fi
}

HC_PERS=/var/lib/holochain
HC_HOME=/home/holochain
HC_KEYS=${HC_HOME}/.config/holochain/keys
HC_COND=${HC_PERS}/conductor-config.toml

make_directory "${HC_PERS}"      holochain:holochain
make_directory "${HC_HOME}/.n3h" holochain:holochain
make_directory "${HC_KEYS}"      holochain:holochain

if [ ! -f "${HC_COND}" ]; then
    cat <<- EOF > "${HC_COND}"
	persistence_dir = "${HC_PERS}"
	agents = []
	dnas = []
	instances = []
	interfaces = []
	bridges = []

	[logger]
	type = "debug"
EOF
    chown holochain:holochain "${HC_COND}"
    chmod 0775                "${HC_COND}"
fi
