{ stdenv, rustPlatform, fetchFromGitHub, perl, xcbuild, darwin, libsodium, openssl, pkgconfig, lib, callPackage, rust }:

let
  mkHolochainBinary = {
      version
      , rev
      , sha256
      , cargoSha256
      , crate
      , ... } @ overrides: rustPlatform.buildRustPackage (lib.attrsets.recursiveUpdate {
    name = "holochain";

    src = lib.makeOverridable fetchFromGitHub {
      owner = "holochain";
      repo = "holochain";
      inherit rev sha256;
    };

    inherit cargoSha256;

    cargoBuildFlags = [
      "--no-default-features"
      "--manifest-path=crates/${crate}/Cargo.toml"
    ];

    nativeBuildInputs = [ perl pkgconfig ] ++ stdenv.lib.optionals stdenv.isDarwin [
      xcbuild
    ];

    buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
      AppKit
      CoreFoundation
      CoreServices
      Security
    ]);

    RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
    RUST_SODIUM_SHARED = "1";

    doCheck = false;
    meta.platforms = [
        "aarch64-linux"
        "x86_64-linux"
        "x86_64-darwin"
    ];
  } (builtins.removeAttrs overrides [
    "rev"
    "sha256"
    "cargoSha256"
    "crate"
  ]));

  mkHolochainAllBinaries = {
    version
    , rev
    , sha256
    , cargoSha256
    , ...
  } @ overrides : {
    holochain = mkHolochainBinary ({
      inherit version rev sha256 cargoSha256;
      crate = "holochain";
    } // overrides );

    dna-util = mkHolochainBinary ({
      inherit version rev sha256 cargoSha256;
      crate = "dna_util";
    } // overrides );

    kitsune-p2p-proxy = mkHolochainBinary ({
      inherit version rev sha256 cargoSha256;
      crate = "kitsune_p2p/proxy";
    } // overrides );
  };

  mkHolochainAllBinariesWithDeps = { version, rev, sha256, cargoSha256, otherDeps }:
    mkHolochainAllBinaries {
      inherit version rev sha256 cargoSha256;
    }
    // otherDeps
    ;

  lair-keystore-0_0_1-alpha_10 = callPackage ./lair-keystore {
    inherit (rust.packages.stable) rustPlatform;
  };

  versions = import ./versions.nix;

  versionsWithDeps = {
    hpos = versions.hpos // {
      otherDeps = {
        lair-keystore = lair-keystore-0_0_1-alpha_10;
      };
    };

    develop = versions.develop // {
      otherDeps = {
        lair-keystore = lair-keystore-0_0_1-alpha_10;
      };
    };

    main = versions.main // {
      otherDeps = {
        lair-keystore = lair-keystore-0_0_1-alpha_10;
      };
    };
  };
in

{
  inherit
    mkHolochainBinary
    mkHolochainAllBinaries
    mkHolochainAllBinariesWithDeps
    ;

  holochainVersions = versions;

  holochainAllBinariesWithDeps = builtins.mapAttrs (_name: value:
    mkHolochainAllBinariesWithDeps value
  ) {
    inherit (versionsWithDeps)
      hpos
      develop
      main
      ;
  };
}
