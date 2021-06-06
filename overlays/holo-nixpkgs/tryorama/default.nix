{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "tryorama";
  src = let repo = fetchFromGitHub {
    owner = "Holochain";
    repo = "tryorama";
    rev = "6a50fa08c7d81bc1ae14cd4254e1308970f0312c";
    sha256 = "1pkcwjasd6qq8k76f0gwc1k8w6x0fp8094xj74n356lhnfpqsnkl";
  };
  in "${repo}/crates/trycp_server";

  cargoSha256 = "1zarjrrvwwifyp4sfphrbd1zw071m456qrdi0rfspc53m2zqrlq6";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
