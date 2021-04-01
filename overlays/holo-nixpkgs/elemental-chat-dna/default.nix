{ stdenv, rustPlatform, fetchFromGitHub, darwin, libsodium, openssl, pkgconfig, lib, callPackage, libiconv, holochain, hc }:


rustPlatform.buildRustPackage {
  name = "elemental-chat-dna";
  
  CARGO_TARGET_DIR = "../target";

  src = fetchFromGitHub {
    owner = "holochain";
    repo = "elemental-chat";
    rev = "fd7ce6a1b74c28f7ee3b3712a9c77cc4239cb679";
    sha256 = "0yslpq3gyqx3h4dpwzp32dws8xgqg980p93wffg3vxcyscy5gz6z";
  };

  cargoSha256 = "10527mp02w4yqxqlrvcg2p497qhg4ri84vkkg0sfk9hk0a1wid04";

  target = "wasm32-unknown-unknown";

  nativeBuildInputs = [ holochain hc ];

  buildInputs = [ openssl ] ++ stdenv.lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    AppKit
    CoreFoundation
    CoreServices
    Security
    libiconv
  ]);
  
#   doCheck = false;
}
