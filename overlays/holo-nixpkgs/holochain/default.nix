{ stdenv, rustPlatform, fetchFromGitHub, perl, xcbuild, darwin, libsodium, openssl, pkgconfig, lib, callPackage }:

rec {
  mkHolochainBinary = {
      version ? "2021-02-02"
      , rev ? "7956904664a7107937c47a8e02386127129697db"
      , sha256 ? "0rfk5id7zjlaib43f6lp30h2rl8fn6wrpw75ix83bs8zcwbm2sml"
      , cargoSha256 ? "0c8i0fvl3w5snk94cb7gqpfx0nlk5480mfp4qbwzip1vv60205s7"
      , crate
      , ... } @ overrides: rustPlatform.buildRustPackage (lib.attrsets.recursiveUpdate {
    name = "holochain";

    src = fetchFromGitHub {
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

  holochain = mkHolochainBinary {
    crate = "holochain";
  };
}
