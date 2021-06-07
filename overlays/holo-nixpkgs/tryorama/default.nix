{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "cb3aaa7003dcef4374bf50bc6281676c024bb401";
    sha256 = "0nr6rjaqkpkvfs8l28fs1xk8235hjwd2zhgyc03mqfk61bkdspab";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1zarjrrvwwifyp4sfphrbd1zw071m456qrdi0rfspc53m2zqrlq6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
