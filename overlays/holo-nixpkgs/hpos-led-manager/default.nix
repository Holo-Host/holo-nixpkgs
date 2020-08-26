{ lib, rustPlatform, gitignoreSource }:

rustPlatform.buildRustPackage {
  name = "hpos-led-manager";
  src = gitignoreSource ./.;

  cargoSha256 = "16rz9d7wr9svcnm8jgssdw1kk6vyihw0jl5x8k7nw7jkm64ch123";
  doCheck = false;
  buildType = "debug";

  meta.platforms = lib.platforms.linux;
}
