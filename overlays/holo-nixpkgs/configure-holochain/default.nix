{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "9fb9e4a20a3c6a274abb4b0093c21b7b00f3955a";
    sha256 = "0yza86497gqz0932qlh0cngw939aq9w8iza9f26wn1chjigdkjx2";
  };

  cargoSha256 = "0vcgbl28c1g78l76rgdnb7akrdb4hcv36niicsr7vx0w7fwr0fj1";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
