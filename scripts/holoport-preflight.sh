
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
REBOOT="${HP_PERS}/reboot"

ZEROTIER="/var/lib/zerotier-one"

# Ensure that our HP_PRS persistence directory exists
[ -d "${HP_PERS}" ] || mkdir -p "${HP_PERS}"

# log "some" "argument list"
[ -t 2 ] && logger_tty=-s
log() { logger ${logger_tty} -p user.notice  -t "${0##*/}:        " "${*}"; }
wrn() { logger ${logger_tty} -p user.warning -t "${0##*/}: WARNING" "${*}"; }
err() { logger ${logger_tty} -p user.error   -t "${0##*/}:   ERROR" "${*}"; }

# set_state <number>
set_state() {
    echo "${1}" > "${PREFLIGHT}"
    log "State in '${PREFLIGHT}' set to: ${1}"
}

# set_hardware <Disk-ID>
set_hardware() {
    echo "${1}" > "${HARDWARE}"
    log "Hardware '${HARDWARE}' set to: ${1}"
}

# Try to load current preflight checklist State; default to "0"
STATE=$( cat "${PREFLIGHT}" 2>/dev/null )
STATE=${STATE:-0}
log "State of '${PREFLIGHT}' is now: ${STATE}"

# Detect the hardware.  Find the root fs' mount define, eg. / -> /dev/sda1, then the disk id
# assigned to that device.
# 
# eg. $ ls -l /dev/disk/by-id
#   ata-VBOX_HARDDISK_VB1de9c612-26d85be5-part1 -> ../../sda1
# or
#   ata-ST1000LM035-1RK172_WL1SAF63-part1 -> ../../sda1
# 
# Use realpath to resolve the possibly symbolic-linked (eg. to a /dev/disk/by-uuid/...)  device path
# to a physical /dev/... device.  Then, see if we can find the corresponding device by ID (which is
# unique in each physical or virtual disk drive).  Use the entire by-id path, instead of trying to
# parse out the serial number.
ROOTMOUNT=$(
    while read src dst typ rest; do
	if [[ ${dst} == "/" ]]; then
	    realpath "${src}" # eg. /dev/disk/by-uuid/4878de65-3c7d-46c2-9ae2-ccb2874094fa ==> /dev/sda1
	    break
	fi
    done < /proc/mounts )
log "Root mount device:  ${ROOTMOUNT}"

DID=$(
    for id in /dev/disk/by-id/*; do
	if [[ $( realpath "${id}" ) == ${ROOTMOUNT} ]]; then
	    echo ${id}
	    break
	fi
    done )
log "Root mount Disk ID: ${DID}"

DID_WAS=$( cat "${HARDWARE}" 2>/dev/null )

if [ -z "${DID}" ]; then
    wrn "Unable to detect a root filesystem Disk ID from mount point '${ROOTMOUNT}'"
else
    # Found a root Disk ID.  If it differs from the one stored, we will (for now) force an identity change
    if [[ "${DID}" != "${DID_WAS}" ]]; then
	# TODO: This must be optional, in the future, to support moving machine images to new hardware!
	# Probably, this should be moved to the `holo init` process.
	wrn "Previous Disk ID: ${DID_WAS}; Resetting State from '${STATE}' to '0' to force SSH, ZeroTier identity reset"
	STATE=0
	set_state 0
	set_hardware "${DID}"
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
    0)  log "Clearing default factory identity configurations, and rebooting."
	# In the initial "0" State (no previous holoport-preflight run), we need to remove any
	# "default" factory identities that were shipped with the image.  This includes ZeroTier
	# networking, SSH host keys, /etc/machine-id, etc.
	if [ -d "${ZEROTIER}" ]; then
	    for f in identity.public identity.secret authtoken.secret; do
		if [ -a    "${ZEROTIER}/${f}" ]; then
		    backup "${ZEROTIER}/${f}" "Removing default ZeroTier configuration"
		    rm -f  "${ZEROTIER}/${f}"
		fi
	    done
	else
	    log "ZeroTier not yet configured; no default identity to clear"
	fi
	for f in /etc/ssh/ssh_host_*; do 
	    backup "${f}" "Removing default SSH Host key"
	    rm -f "${f}"
	done
	# Remove any existing /etc/machine-id, which is (possibly) the same as other Hosts'
	if [ -s /etc/machine-id ]; then
	    backup "/etc/machine-id" "Removing default /etc/machine-id"
	    rm -f /etc/machine-id
	fi
	set_state 1
	# Any /etc/machine-id change requires a reboot (systemd, etc. depends on this)
	echo "Changed ZeroTier, SSH Host and /etc/machine-id" >> ${REBOOT}
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

# If we've detected a situation that requires reboot, signalled by creating a
# /var/lib/holoport/reboot file, give indication of that now.  The actual reboot should be carried
# out manually, or by other phases of the system (eg. `holo init`).  We depend on
# boot.init.postMountCommands (in ../modules/base.nix) to remove this file, on the next boot.  This
# ensures that, once we detect and mitigate possibly cloned machine-id, etc, each time we restart
# holoport-preflight.service, it will (again) warn the operator to reboot the machine.
if [ -a "${REBOOT}" ]; then
    msg=$( cat "${REBOOT}" )
    wrn "Please reboot system, due to: ${msg}"
    echo -e "holoport-preflight.service: Please reboot HoloPort, due to:\n\n    ${msg}" | wall
fi

exit 0
