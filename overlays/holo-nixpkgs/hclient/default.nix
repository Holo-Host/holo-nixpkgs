{ stdenv, fetchFromGitHub, npmToNix, nodejs }:

stdenv.mkDerivation rec {
  name = "hclient";

  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hclient.js";
    rev = "09551659f4ba877e2e2e010bbb1b480059663ca5";
    sha256 = "1w1sljpblf9bj66wagscn7drjdzz9lby7d0y39ai91xq9mlg67xy";
  };

  nativeBuildInputs = [ nodejs ];

  preConfigure = ''
    cp -r ${npmToNix { inherit src; }} node_modules
    chmod -R +w node_modules
    patchShebangs node_modules
  '';

  buildPhase = ''
    node_modules/typescript/bin/tsc -d
  '';

  installPhase = ''
    mkdir $out
    mv * $out
  '';

  fixupPhase = ''
    patchShebangs $out
  '';
}
