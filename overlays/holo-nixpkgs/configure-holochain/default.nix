{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "e52ac50acc31e7e8dcddab0ff0a8cbd90ae3d6b6";
    sha256 = "10mk138y2hl5xgpl110yvspvrjcs5p341ixrn7avlziw3cp52fnf";
  };

  cargoSha256 = "0cjx904pwa9vczr2gvp1ifshl1vkq4fxc0r9djl2mjzi8x4aa8ak";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
