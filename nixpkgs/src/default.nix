let
  nixpkgs = fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/0aa5f60434dc276bcbf66636601aeefd079d72ba.tar.gz";
    sha256 = "1ds852m0jy8qsc5ilrjjr25sy3q12n7hfhxawxmqpi8mwmng9cxc";
  };

  inherit (import nixpkgs {}) stdenvNoCC fetchpatch;
in

stdenvNoCC.mkDerivation {
  name = "nixpkgs";
  src = nixpkgs;

  patches = [ ./virtualbox-image-no-audio-mouse-usb.diff ];

  phases = [ "unpackPhase" "patchPhase" "installPhase" ];

  installPhase = ''
    mv $PWD $out
  '';
}
