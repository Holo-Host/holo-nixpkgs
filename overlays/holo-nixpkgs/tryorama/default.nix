{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "99c9c35d2961c3c90f3f9f330ee9495cf4310233";
    sha256 = "10nywspr7iv3mzwggcr6gbjha1n7np2x6lh732mf9khssk7i0q1q";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1zarjrrvwwifyp4sfphrbd1zw071m456qrdi0rfspc53m2zqrlq6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
