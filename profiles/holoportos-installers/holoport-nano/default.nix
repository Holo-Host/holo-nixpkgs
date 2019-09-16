{ config, pkgs, ... }:

let
  nixpkgs = import ../../../nixpkgs/source.nix;
in

{
  imports = [
    "${nixpkgs}/nixos/modules/installer/cd-dvd/sd-image.nix"
    ../../hardware/holoport-nano
    ../.
  ];

  sdImage.imageName = "${config.system.build.baseName}.img";

  sdImage.populateFirmwareCommands = ''
    dd conv=notrunc if=${pkgs.ubootBananaPim64}/u-boot-sunxi-with-spl.bin of=$img bs=8k seek=1
  '';

  sdImage.populateRootCommands = with pkgs; ''
    ${buildPackages.extlinux-conf-builder} \
      -b ${holoport-nano-dtb} \
      -c ${config.system.build.toplevel} \
      -d boot \
      -t 1
  '';
}
