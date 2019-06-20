#!/usr/bin/env bash

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

# Current version of preflight checklist.
CURRENT=v1

# Option flags. Set DRYRUN to non-zero value to avoid performing file mutations.
DRYRUN=

# Persistence files for holoport-preflight, zerotier, etc.
HP_PERS="/var/lib/holoport"
PREFLIGHT="${HP_PERS}/preflight"

ZEROTIER="/var/lib/zerotier-one"

# Process arguments
while [[ "${1#-}" != "${1}" ]]; do
    case "${1}" in
	--dry-run|-d)
	    DRYRUN=1
	    ;;
	*)
	    $ERR "Invalid option: ${1}"
	    exit 1
    esac
    shift
done

# Ensure that our HP_PRS persistence directory exists
(( DRYRUN )) || [ -d "${HP_PERS}" ] || mkdir -p "${HP_PERS}"

# Try to load current preflight checklist State; default to "initial"
STATE=$( cat "${PREFLIGHT}" 2>/dev/null )
STATE=${STATE:-initial}
BACKUP="${HP_PERS}/backup/${STATE}"	# Store copies of mutated files here

# log "some" "argument list"
log() { logger -sp user.notice  -t "${0##*/}:        " "${*}"; }
wrn() { logger -sp user.warning -t "${0##*/}: WARNING" "${*}"; }
err() { logger -sp user.error   -t "${0##*/}:   ERROR" "${*}"; }

# backup file [description]
backup() {
    if [ -a "${1}" ]; then
	if [ ! -d "${BACKUP}" ]; then
	    log "Backing up modified files to ${BACKUP} (to restore, run: sudo rsync -va --dry-run ${BACKUP}/ /)"
	    (( DRYRUN )) || mkdir -p "${BACKUP}"
	fi
	wrn "${2:-Copying file} (backing up ${1})"
	rsync ${DRYRUN:+--dry-run} -aR "${1}" "${BACKUP}/" # keeps full relative/absolute path
    fi
}

# Evaluate the system STATE as found in the PREFLIGHT file.  Any files requiring modification or
# removal will first be copied into the HP_PERS persistence backup directory,
# eg. /var/lib/holoport/backup/initial/...
case "${STATE}" in
    initial)
	# In the initial state (no previous holoport-preflight run), we need to remove any "default"
	# factory identities that were shipped with the image.  This includes ZeroTier networking,
	# SSH host keys, etc.
	log "Clearing initial factory configurations"
	for f in identity.public identity.secret authtoken.secret; do
	    if [ -a    "${ZEROTIER}/${f}" ]; then
		backup "${ZEROTIER}/${f}" "Removing default ZeroTier configuration"
		(( DRYRUN )) || rm -f "${ZEROTIER}/${f}"
	    fi
	done
	for f in /etc/ssh/ssh_host_*; do 
	    backup "${f}" "Removing default SSH Host key"
	    (( DRYRUN )) || rm -f "${f}"
	done
	;& # fall thru
    # ... Add each new STAT
    ${CURRENT})
        log "HoloPortOS Configuration State is CURRENT: ${CURRENT}"
	;;

    *)
	err "Unknown State: '${STATE}'; Not repairing!"
	log "  To fix, check/repair system manually, and store '${CURRENT}' in ${PREFLIGHT} to restore functionality)"
    	exit 0
        ;;
esac

# Finally, note that the system's preflight checklist state is CURRENT
(( DRYRUN )) || echo "${CURRENT}" > "${PREFLIGHT}"

exit 0
