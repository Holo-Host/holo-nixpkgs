let
  nixpkgs = import ../vendor/nixpkgs;

  inherit (import nixpkgs {}) stdenvNoCC fetchpatch;
in

import (stdenvNoCC.mkDerivation {
  name = "nixpkgs";
  src = nixpkgs;

  patches = [
    ./ext4-no-resize2fs.diff
    ./kmod-cross.diff
    ./rust-windows-cross.diff
  ];

  phases = [ "unpackPhase" "patchPhase" "installPhase" ];

  installPhase = ''
    mv $(pwd) $out
  '';
})
