{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "a97a1fb5709a5a93f7fb46c5e6f99a777ca94355";
    sha256 = "04ql2awkkla8qmvnx6cnkwibzgcd8j2qwkii5ndzj9s6pgbbh1hg";
  };

  cargoSha256 = "0ndnfk5bam05bafadib21m8cm0k7jsly78cjxrbcgjllglg190zk";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
