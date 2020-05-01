let
  nixpkgs = fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/73e73c7d6b5f9aace09a2aa12beb8688b3d7b7c8.tar.gz";
    sha256 = "05cgchpz64pz2gh89b43wqar9yzvi57h3rmssmqf3r77xgyiswff";
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
