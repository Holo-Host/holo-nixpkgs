{ config, pkgs, ... }:

let
  nixpkgs = import ../../../nixpkgs/src;
in

{
  imports = [
    "${nixpkgs}/nixos/modules/installer/cd-dvd/sd-image.nix"
    ../../physical/hpos/holoport-nano
    ../.
  ];
  
  nix.package = let
    nixpkgs-1909-latest = import (fetchTarball https://github.com/NixOS/nixpkgs-channels/archive/nixos-19.09.tar.gz) {};
  in nixpkgs-1909-latest.nix;
  
  environment.systemPackages = with pkgs; [ git ];

  sdImage.imageName = "${config.system.build.baseName}.img";

  sdImage.populateFirmwareCommands = ''
    dd conv=notrunc if=${pkgs.ubootBananaPim64}/u-boot-sunxi-with-spl.bin of=$img bs=8k seek=1
  '';

  sdImage.populateRootCommands = with pkgs; ''
    mkdir -p ./files/boot
    ${buildPackages.extlinux-conf-builder} \
      -b ${holoport-nano-dtb} \
      -c ${config.system.build.toplevel} \
      -d ./files/boot \
      -t 1
  '';
}

