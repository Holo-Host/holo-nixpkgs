{ pkgs }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
in

{
  holo-auth = rustPlatform.buildRustPackage {
    name = "holo-auth";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "holo-auth";
      rev = "43009e8ab644621dd4272c4723d0e603412f062b";
      sha256 = "1c8p9xjhfxgh11vf55fwkglffv0qjc8gzc98kybqznhm81l8y2fl";
    };

    cargoSha256 = "021g6416kpfqm800c24nvvmaxsm2ywxkps2pzaydm9vhpvnhpdqb";
    
    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}