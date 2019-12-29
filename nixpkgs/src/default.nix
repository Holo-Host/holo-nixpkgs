let
  nixpkgs = fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/5f506b95f9f6290f4c46f523cc3f5cef581c5666.tar.gz";
    sha256 = "14ry2fs2pny2shlg2dq8c9vns636gv0zvfh0dmyy4bnq713k377n";
  };

  inherit (import nixpkgs {}) stdenvNoCC fetchpatch;
in

stdenvNoCC.mkDerivation {
  name = "nixpkgs";
  src = nixpkgs;

  patches = [
    ./ext4-no-resize2fs.diff
    ./rust-aarch64-musl-cross.diff
    ./rust-home.diff
  ];

  phases = [ "unpackPhase" "patchPhase" "installPhase" ];

  installPhase = ''
    mv $PWD $out
  '';
}
