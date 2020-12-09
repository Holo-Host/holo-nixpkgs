
This profile is specifically set up for building HoloportOS installation images from source.

# HoloPort Nano SD Image

On an Aarch64 machine (hydra-minion-1.holo.host), run `nix-shell` 

run: nix-build '<nixpkgs/nixos>' -A config.system.build.sdImage -I nixos-config=./profiles/installers/holoport-nano/default.nix.

Download image and burn it to a microSD card with sudo dd if=result/sd-image/*.img of=/dev/sdX (see lsblk on Linux and diskutil list on macOS for the exact device name). Note it may be a .zst that you have to unpack using unzstd before burning.

Connect Ethernet cable to HoloPort Nano, insert the microSD card, and boot.


# HoloPort Image

On an linux-x64 machine, run: nix-build '<nixpkgs/nixos>' -A config.system.build.isoImage -I nixos-config=./profiles/installers/holoport/default.nix.

Burn the image to a USB stick with sudo dd if=result/iso-image/*.img /dev/sdX (see lsblk on Linux and diskutil list on macOS for the exact device name). Note it may be a .zst that you have to unzip using zstd before burning

Plug into to HoloPort. Boot HoloPort and press <Del> during boot sequence to get to BIOS

