{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "1b8c152960259966e8b90891094b265863be7edf";
    sha256 = "146p0lxrqgy9y4sdm78xhjpvhc3jdkdhlb022v2is8djd1ckslfp";
  };

  cargoSha256 = "0k1zr5adaapj5vsxk17nx3y2yl5li44jvd5hmjgmq7099crf1di0";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
