{ stdenv, rustPlatform, fetchFromGitHub, perl, xcbuild, darwin, libsodium, openssl, pkgconfig, lib, callPackage, rust, libiconv }:

let
  mkHolochainBinary = {
      rev
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

    nativeBuildInputs = [ perl pkgconfig ] ++ lib.optionals stdenv.isDarwin [
      xcbuild
    ];

    buildInputs = [ openssl ]
      ++ lib.optionals stdenv.isDarwin (
        builtins.attrValues (darwin.apple_sdk.frameworks)
        ++ [ libiconv ]
      )
      ;

    RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
    RUST_SODIUM_SHARED = "1";

    doCheck = false;
    meta.platforms = [
        "aarch64-linux"
        "x86_64-linux"
        "x86_64-darwin"
    ];
  } # remove attributes that cause failure when they're passed to `buildRustPackage`
    (builtins.removeAttrs overrides [
    "rev"
    "sha256"
    "cargoSha256"
    "crate"
    "bins"
  ]));

  mkHolochainAllBinaries = {
    rev
    , sha256
    , cargoSha256
    , bins
    , ...
  } @ overrides:
    lib.attrsets.mapAttrs (_: crate:
      mkHolochainBinary ({
        inherit rev sha256 cargoSha256 crate;
      } // overrides)
    ) bins
  ;

  mkHolochainAllBinariesWithDeps = { rev, sha256, cargoSha256, otherDeps, bins }:
    mkHolochainAllBinaries {
      inherit rev sha256 cargoSha256 bins;
    }
    // otherDeps
    ;

  lair-keystore = callPackage ./lair-keystore {
    inherit (rust.packages.stable) rustPlatform;
  };

  versions = import ./versions.nix;

  versionsWithDeps = {
    hpos = versions.hpos // {
      otherDeps = {
        inherit lair-keystore;
      };
    };

    develop = versions.develop // {
      otherDeps = {
        inherit lair-keystore;
      };
    };

    main = versions.main // {
      otherDeps = {
        inherit lair-keystore;
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
