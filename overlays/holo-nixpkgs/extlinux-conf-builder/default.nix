{ lib, substituteAll, bash, coreutils, gnused, gnugrep }:

substituteAll {
  src = ./extlinux-conf-builder.sh;
  isExecutable = true;

  inherit bash;
  path = lib.makeBinPath [ coreutils gnused gnugrep ];

  meta.platforms = lib.platforms.linux;
}
