{ lib
, gitignoreSource
, runCommand
, substituteAll
, bash
, coreutils
, e2fsprogs
, parted
, ubootBananaPim64
}:

{ channelUrl, target }:

let
  mkConfiguration = profile: substituteAll {
    src = ./configuration.nix.in;
    inherit profile;
  };

  mkTarget = { profile, prePhase, postPhase ? "" }: substituteAll {
    src = ./hpos-install.sh;
    isExecutable = true;

    channel = runCommand "channel" {} ''
      mkdir $out && ln -s ${gitignoreSource ../../../.} $out/holo-nixpkgs;
    '';
    configuration = mkConfiguration profile;
    path = lib.makeBinPath [ coreutils e2fsprogs parted ];
    inherit bash channelUrl prePhase postPhase;
  };

  targets = {
    holoport = mkTarget {
      profile = "<holo-nixpkgs/profiles/targets/holoport>";

      prePhase = ''
        parted /dev/sda --align optimal --script \
          mklabel msdos \
          mkpart primary 0% 100% \
          set 1 boot on

        mkfs.ext4 -F /dev/sda1
        mount /dev/sda1 /mnt
      '';
    };

    holoport-nano = mkTarget {
      profile = "<holo-nixpkgs/profiles/targets/holoport-nano>";

      prePhase = ''
        parted /dev/mmcblk2 --align optimal --script \
          mklabel msdos \
          mkpart primary 0% 100% \
          set 1 boot on

        mkfs.ext4 -F /dev/mmcblk2p1
        mount /dev/mmcblk2p1 /mnt
      '';

      postPhase = ''
        dd if=${ubootBananaPim64}/u-boot-sunxi-with-spl.bin of=/dev/mmcblk2 bs=8k seek=1
      '';
    };

    holoport-plus = mkTarget {
      profile = "<holo-nixpkgs/profiles/targets/holoport-plus>";

      prePhase = ''
        parted /dev/sda --align optimal --script \
          mklabel msdos \
          mkpart primary 0% 100% \
          set 1 boot on

        mkfs.ext4 -F /dev/sda1
        mount /dev/sda1 /mnt
      '';
    };
  };
in

runCommand "hpos-install" { meta.platforms = lib.platforms.linux; } ''
  install -D ${lib.getAttr target targets} $out/bin/hpos-install
''
