{ holoport ? { outPath = ./.; revCount = 0; shortRev = "holoportos-testnet-dev-18.09"; }
, nixpkgs ? { outPath = fetchTarball "https://github.com/Holo-Host/nixpkgs-channels/archive/nixos-18.09.tar.gz";
              revCount = 0; shortRev = "latest"; }
, system ? builtins.currentSystem, nixpkgsArgs ? { config = { allowUnfree = true; inHydra = true; }; }
}:

let

  pkgs = import nixpkgs { inherit system; };
  lib = pkgs.lib;

  nixpkgsVersion = lib.fileContents "${nixpkgs}/.version";
  nixpkgsVersionSuffix = ".${toString nixpkgs.revCount}.${nixpkgs.shortRev}";

  mkTest = import "${nixpkgs}/nixos/tests/make-test.nix";
  mkTestJob = t:
    let
      job = lib.hydraJob ((mkTest (import t)) { inherit system; });
    in {
      name = lib.removePrefix "vm-test-run-" job.name;
      value = job;
    };

in

rec {
  tests = lib.listToAttrs (map mkTestJob (import ./tests/all-tests.nix));

  iso = import lib/make-iso.nix { inherit nixpkgs system holoport nixpkgsVersionSuffix; };

  channels.nixpkgs = import "${nixpkgs}/nixos/lib/make-channel.nix" {
    inherit pkgs nixpkgs;
    version = nixpkgsVersion;
    versionSuffix = nixpkgsVersionSuffix;
  };

  channels.holoport-testnet = pkgs.releaseTools.makeSourceTarball {
    name = "holoport-testnet-dev-18_09-channel";
    src = holoport;
    version = lib.fileContents ./.version;
    versionSuffix = ".${toString holoport.revCount}.${holoport.shortRev}";

    distPhase = ''
      rm -rf .git*
      echo -n "$VERSION_SUFFIX" > .version-suffix
      echo -n ${holoport.rev or holoport.shortRev} > .git-revision
      releaseName=holoport-$VERSION$VERSION_SUFFIX
      mkdir -p $out/tarballs
      cp -prd . ../$releaseName
      cd ..
      chmod -R u+w $releaseName
      tar cfJ $out/tarballs/$releaseName.tar.xz $releaseName
    '';
  };

  tested = lib.hydraJob (pkgs.releaseTools.aggregate {
    name = "nixos-${channels.nixpkgs.version}+holoport-testnet-dev-${channels.holoport-testnet.version}";
    meta = {
      description = "Release-critical builds for holoportOS";
    };
    constituents = [
      iso
      channels.nixpkgs
      channels.holoport-testnet
    ] ++ (lib.attrValues tests);
  });
}
