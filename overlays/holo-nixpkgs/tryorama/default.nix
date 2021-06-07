{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "b639b8303144c3952e6915ae7b5e40979b6d8b78";
    sha256 = "0b9hrdh2an5jn6d84chncy9l6dpryn90fjy4vywdhi9si3y0ckbq";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1zarjrrvwwifyp4sfphrbd1zw071m456qrdi0rfspc53m2zqrlq6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
