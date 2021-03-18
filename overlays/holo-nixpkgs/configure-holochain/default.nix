{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "5457fa9a156ef164f3791a8f7c7ac20174ab9cef";
    sha256 = "04ql2awkkla8qmvnx6cnkwibzgcd8j2qwkii5ndzj9s6pgbbh1hf";
  };

  cargoSha256 = "0ndnfk5bam05bafadib21m8cm0k7jsly78cjxrbcgjllglg190zk";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
