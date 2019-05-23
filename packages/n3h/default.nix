{ pkgs, fetchzip }:
let
  src = fetchzip {
    url = "https://github.com/samrose/n3h/archive/d3b36c4ab3323b9a8f2a45ca6192f683c72b09fc.tar.gz";
    sha256 = "1wll888y40n66d92k36jsdgv8rg2rykcd1w3mirr7wmn78gjzkd5";
  };
  n3h = pkgs.callPackage src {};
in n3h.package