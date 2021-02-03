{ lib, rustPlatform, gitignoreSource }:

rustPlatform.buildRustPackage {
  name = "hpos-led-manager";
  src = gitignoreSource ./.;

  cargoSha256 = "1mlvl1jzjldzrxx4br7r61qmzrz8x0kcc64s6blhsfi68jh1898p";
  doCheck = false;

  meta.platforms = lib.platforms.linux;
}
