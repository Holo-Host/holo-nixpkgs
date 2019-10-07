#!/usr/bin/env bash

# 
# Run a Debian Installer iso, then boot
# 
# See: http://www.redfelineninja.org.uk/daniel/2018/02/running-an-iso-installer-image-for-arm64-aarch64-using-qemu-and-kvm/
#
# $ wget https://cdimage.debian.org/debian-cd/current/arm64/iso-cd/debian-10.1.0-arm64-netinst.iso
# $ wget http://snapshots.linaro.org/components/kernel/leg-virt-tianocore-edk2-upstream/latest/QEMU-AARCH64/RELEASE_GCC5/QEMU_EFI.img.gz
# $ gunzip QEMU_EFI.img.gz
# $ qemu-img create -f qcow2 aarch64-debian.img 128G
# $ qemu-img create -f qcow2 aarch64-varstore.img 64M
# 
# When installing, in the "Detect and mount CD-ROM":
# 
# - Load CD-ROM drivers from removable media?: Select No
# - Manually select a CD-ROM module and device?: Select Yes
# - Module needed for accessing the CD-ROM: Select none
# - Device file for accessing the CD-ROM: Enter /dev/vdb and press Continue
#

SMP="-smp 8"
# SSH to qumu host on localhost:2222
NET="-device e1000,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22"
CPU="-cpu cortex-a53 -M virt -m 4096 -nographic"
EFI="-drive if=pflash,format=raw,file=QEMU_EFI.img"
VAR="-drive if=pflash,file=aarch64-varstore.img"
IMG="-drive if=virtio,file=aarch64-debian.img"
# Add this back in, to configure a QEMU booting from the installer ISO:
ISO="-drive if=virtio,format=raw,file=debian-10.1.0-arm64-netinst.iso"

qemu-system-aarch64 $SMP $NET $CPU $EFI $VAR $IMG # $ISO
