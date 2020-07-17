{ lib, rustPlatform, gitignoreSource, pkg-config, openssl }:

rustPlatform.buildRustPackage {
  name = "hpos-led-manager";
  src = gitignoreSource ./.;

  buildInputs = [ pkg-config openssl ];

  cargoSha256 = "0xyp5vrhxyafymv3xfajwspn61k4g6w9iaf470r9mbxgvblw9lkr";
  doCheck = false;

  meta.platforms = lib.platforms.linux;
}
