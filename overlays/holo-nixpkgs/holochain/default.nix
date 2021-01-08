{ stdenv, rustPlatform, fetchFromGitHub, perl, CoreServices, Security, libsodium, openssl, pkgconfig, lib, callPackage }:

rec {
  mkHolochainBinary = {
        version ? "2020-12-17"
      , rev ? "6bd822cf3378178b5600ab79d8560f04b5a5b837"
      , sha256 ? "1xcg30wwnicmz8yaz8vgi0x7z0ygjq3kkdpzp9743swqik4c0g6z"
      , cargoSha256 ? "12nsp4xwfy0sa1v5wa4r8lskwpn1h5kr23qg5dvjlb20maxrp5dc"
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

    nativeBuildInputs = [ perl pkgconfig ];

    buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin [
      CoreServices
      Security
    ];

    RUST_SODIUM_LIB_DIR = "${libsodium}/lib";
    RUST_SODIUM_SHARED = "1";

    doCheck = false;
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
