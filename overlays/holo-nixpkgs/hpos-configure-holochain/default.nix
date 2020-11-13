{ pkgs }:

with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
in

{
  hpos-configure-holochain = rustPlatform.buildRustPackage {
    name = "hpos-configure-holochain";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "hpos-configure-holochain";
      rev = "9364c1c1c4832fa8e0c1513707554dcfcac2f8b3";
      sha256 = "1hc7i46hknvv2afm4ccynql7pf73kp7rcb7vhdfhazna357mbll0";
    };

    cargoSha256 = "1ykz4j8igr438cmv3lrl0qwvsfc2013rvjch2lm1zrr55yhf5nlk";

    nativeBuildInputs = [ pkgconfig ];
    buildInputs = [ openssl ];

    meta.platforms = lib.platforms.linux;
  };
}
