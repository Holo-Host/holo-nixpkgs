let
  nixpkgs = fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/c5d5561f772f9ed9de272e3ccb7426de6e862dd1.tar.gz";
    sha256 = "1n41kg3xl2lbwywxpm1bdi37vbrhcww2kg6rl2lwfj9fg7w5sl76";
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
    ./rustup_add_zlib.diff
    ./virtualbox-image-no-audio-mouse-usb.diff
    ./zerotier-1.4.6.patch
  ];

  phases = [ "unpackPhase" "patchPhase" "installPhase" ];

  installPhase = ''
    mv $PWD $out
  '';
}
