{ stdenv, fetchpatch, dtc, linux }:

let
  cpp = if stdenv.buildPlatform == stdenv.hostPlatform
  then "cpp"
  else "${stdenv.hostPlatform.config}-cpp";
in

stdenv.mkDerivation {
  name = "${linux.name}-holoport-nano-dtb";
  inherit (linux) src;

  nativeBuildInputs = [ dtc ];

  patches = [
    ./uart2.diff
  ];

  buildPhase = ":";

  installPhase = ''
    mkdir -p $out/allwinner

    ${cpp} -nostdinc -I include -x assembler-with-cpp \
      arch/arm64/boot/dts/allwinner/sun50i-a64-bananapi-m64.dts \
      | dtc > $out/allwinner/sun50i-a64-bananapi-m64.dtb
  '';

  meta.platforms = stdenv.lib.platforms.linux;
}
