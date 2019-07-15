{ pkgs, fetchzip }:
let
  src = fetchzip {
    url = "https://github.com/samrose/n3h/archive/628209212366767343900d82e412a717e9cbec1b.tar.gz";
    sha256 = "1zw1xb133c13rlvxvqs5sl93hdvaxgg5i3k1p2i7kphzm3rilz4l";
};
  n3h = pkgs.callPackage src {};
in n3h.package