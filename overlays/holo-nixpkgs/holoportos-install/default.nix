{ lib, gitignoreSource, runCommand, substituteAll, aurora-led, bash, coreutils
, e2fsprogs, parted, ubootBananaPim64 }:

{ auroraLedDevice, channelUrl, target }:

let
  mkConfiguration = profile: substituteAll {
    src = ./configuration.nix;
    inherit profile;
  };

  mkTarget = { profile, prePhase, postPhase ? "" }: substituteAll {
    src = ./holoportos-install.sh;
    isExecutable = true;

    channel = runCommand "channel" {} ''
      mkdir $out && ln -s ${gitignoreSource ../../../.} $out/holo-nixpkgs;
    '';
    configuration = mkConfiguration profile;
    path = lib.makeBinPath [ aurora-led coreutils e2fsprogs parted ];
    inherit bash auroraLedDevice channelUrl prePhase postPhase;
  };

  targets = {
    holoport = mkTarget {
      profile = "<holo-nixpkgs/profiles/hardware/holoport>";

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
      profile = "<holo-nixpkgs/profiles/hardware/holoport-nano>";

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
      profile = "<holo-nixpkgs/profiles/hardware/holoport-plus>";

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

runCommand "holoportos-install" { meta.platforms = lib.platforms.linux; } ''
  install -D ${lib.getAttr target targets} $out/bin/holoportos-install
''
