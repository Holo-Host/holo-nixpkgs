
# 
# holoport-preflight -- Ensure that known mutable HoloPortOS configuration issues are corrected
# 
# DESCRIPTION
# 
#     As HoloPortOS evolves, we will likely discover that certain mutable state and configuration
# data needs to be adjusted.  The underlying software delivered is controlled by Nix configuration,
# and can be assumed to be consistent and valid.  However, the system is controlled by various
# mutable configuration and state files, which may (for various reasons) end up containing invalid,
# inconsistent or otherwise incorrect data.
# 
#     When we detect such a situation, we can place tests here to mitigate the issue.
# 
#     After bringing a node up to a certain level of holoport-preflight, we'll output the CURRENT
# state to /var/lib/holoport/preflight.
#
#     As CURRENT is advanced, remember to add the last version to the `case "${STATE}" in`, below,
# or holoport-preflight will begin to fail to keep the system up-to-date.
# 
# WARNING
# 
#     It is recommended that this script *not* exit with a non-zero exit value, to avoid interfering
# with later systemd services.  It should make a best-effort attempt to update the system, and warn
# about persistent problems.  If an important update cannot be effected, then it is best to simply
# *leave* the PREFLIGHT file as-is, and have the script re-issue an explanatory warning on each run.
# 

# Current version of preflight checklist.
CURRENT=1

# Persistence files for holoport-preflight, zerotier, etc.
HP_PERS="/var/lib/holoport"
PREFLIGHT="${HP_PERS}/preflight"
HARDWARE="${HP_PERS}/hardware"

ZEROTIER="/var/lib/zerotier-one"

# Ensure that our HP_PRS persistence directory exists
[ -d "${HP_PERS}" ] || mkdir -p "${HP_PERS}"

# log "some" "argument list"
[ -t 2 ] && tty=-s
log() { logger ${tty} -p user.notice  -t "${0##*/}:        " "${*}"; }
wrn() { logger ${tty} -p user.warning -t "${0##*/}: WARNING" "${*}"; }
err() { logger ${tty} -p user.error   -t "${0##*/}:   ERROR" "${*}"; }

# set_state <number>
set_state() {
    echo "${1}" > "${PREFLIGHT}"
    log "State in '${PREFLIGHT}' set to: ${1}"
}

# set_hardware <MAC>
set_hardware() {
    echo "${1}" > "${HARDWARE}"
    log "Hardware '${HARDWARE}' set to: ${1}"
}

# Try to load current preflight checklist State; default to "initial"
STATE=$( cat "${PREFLIGHT}" 2>/dev/null )
STATE=${STATE:-0}
log "State of '${PREFLIGHT}' is now: ${STATE}"

# Detect the hardware.  Use the lowest numbered physical ethernet interface, eg 'enp0s3'.  If
# we can't detect a physical interface, carry on (assuming nothing has changed?)
INTERFACE=$( ls -1 /sys/class/net | grep '^enp' | sort | head -1 )
MAC=$( cat /sys/class/net/${INTERFACE}/address 2>/dev/null )
MAC_WAS=$( cat "${HARDWARE}" 2>/dev/null )
log "Hardware '${HARDWARE}' was '${MAC_WAS}'; is now '${MAC}'"

if [ -z "${MAC}" ]; then
    wrn "Unable to detect a primary Ethernet interfaces MAC from: $( ls /sys/class/net )"
else
    # Found a MAC.  If it differs from the one stored, we will (for now) force an identity change
    if [[ "${MAC}" != "${MAC_WAS}" ]]; then
	# TODO: This must be optional, in the future, to support moving machine images to new hardware!
	# Probalby, this should be moved to the `holo init` process.
	wrn "Hardware MAC '${MAC}' (from Ethernet '${INTERFACE}') mismatch; was: '${MAC_WAS}'"
	wrn" - Resetting State from '${STATE}' to '0' to force SSH Host key and ZeroTier identity reset"
	STATE=0
	set_state 0
	set_hardware "${MAC}"
    fi
fi

BACKUP="${HP_PERS}/backup/${STATE}"	# Store copies of mutated files here

# backup <file> [<description>]
backup() {
    if [ -a "${1}" ]; then
	if [ ! -d "${BACKUP}" ]; then
	    log "Backing up modified files to ${BACKUP} (to restore, run: sudo rsync -va --dry-run ${BACKUP}/ /)"
	    mkdir -p "${BACKUP}"
	fi
	wrn "${2:-Copying file} (backing up ${1})"
	rsync -aR "${1}" "${BACKUP}/" # keeps full relative/absolute path
    fi
}

# Evaluate the system STATE as found in the PREFLIGHT file.  Any files requiring modification or
# removal will first be copied into the HP_PERS persistence backup directory,
# eg. /var/lib/holoport/backup/initial/...
case "${STATE}" in
    0)  log "Clearing default factory configurations"
	# In the initial "0" State (no previous holoport-preflight run), we need to remove any
	# "default" factory identities that were shipped with the image.  This includes ZeroTier
	# networking, SSH host keys, etc.
	for f in identity.public identity.secret authtoken.secret; do
	    if [ -a    "${ZEROTIER}/${f}" ]; then
		backup "${ZEROTIER}/${f}" "Removing default ZeroTier configuration"
		rm -f  "${ZEROTIER}/${f}"
	    fi
	done
	for f in /etc/ssh/ssh_host_*; do 
	    backup "${f}" "Removing default SSH Host key"
	    rm -f "${f}"
	done
	set_state 1
	;& # fall thru

    # Add each historical STATE here, each falling thru to the next, implementing the checks/fixes
    # required to upgrade to the next state.  After processing changes, before falling through,
    # invoke set_state to the next state.

    ${CURRENT}) log "HoloPortOS Configuration State is CURRENT: ${CURRENT}"
	;;

    *)  err "Unknown State: '${STATE}'; Not repairing!"
        log "  To fix, check/repair manually, and store '${CURRENT}' in ${PREFLIGHT} to restore functionality"
        ;;
esac


exit 0
