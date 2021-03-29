{ pkgs ? import ./. {} }:

with pkgs;
with lib;

let
  dotName = key: set:
    let
      jobset = getAttr key set;
      derivations = filter (system: isDerivation (getAttr system jobset)) (attrNames jobset);
    in
      map( val: key + "." + val ) derivations;

  overlay = import ./overlays/holo-nixpkgs;

  overlayPackages =
    recurseIntoAttrs (getAttrs (attrNames (overlay {} {})) pkgs);

  release-lib = import (pkgs.path + "/pkgs/top-level/release-lib.nix");
in

  with release-lib {
    nixpkgsArgs.overlays = [ overlay ];
    supportedSystems = [
      "aarch64-linux"
      "x86_64-linux"
      "x86_64-darwin"
    ];
  };

  let
    self = mapTestOn (packagePlatforms overlayPackages);
  in

    self // {
      holo-nixpkgs = releaseTools.channel {
        name = "holo-nixpkgs";
        src = gitignoreSource ./.;
        constituents = concatLists (map (key: dotName key self) (attrNames self));
      };
    }
