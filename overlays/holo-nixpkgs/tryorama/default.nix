{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "a6aec6612416f216df66d804899fdf66193126bc";
    sha256 = "0qdi7v1lh4n3vhh4456jmdqn8q8596h3902gpicnfil2343bbf1c";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1zarjrrvwwifyp4sfphrbd1zw071m456qrdi0rfspc53m2zqrlq6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
