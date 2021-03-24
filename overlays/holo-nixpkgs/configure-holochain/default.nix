{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "a97a1fb5709a5a93f7fb46c5e6f99a777ca94355";
    sha256 = "0dbg7lnb0clkwkg91zsvmx2gjqzn7gbbay61jsbgzc667ygiplwh";
  };

  cargoSha256 = "1xaxm2kdjr5q5ks8pka5plpbhn5ykjl63glynalzmwnf10klhc06";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
