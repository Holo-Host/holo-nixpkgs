{ pkgs, fetchzip }:
let
  src = fetchzip {
    url = "https://github.com/samrose/n3h/archive/4c3541a7432b4f0ac72cb3dac83affc062f055e1.tar.gz";
    sha256 = "1cbdjjg0nxm4bwvw7l6srhlll1iiz2il1kggvkhbh7c0c830fr2w";
};
  n3h = pkgs.callPackage src {};
in n3h.package