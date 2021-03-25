{ stdenv
, rustPlatform
, fetchFromGitHub
, makeWrapper
, nodejs
, npmToNix
, ps
, python
, fetchgit
, mkYarnPackage
}:

mkYarnPackage rec {
  name = "holo-envoy";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-envoy";
    rev = "ddb58cdde36797dce19a345e3f269598e9e6b6b3";
    sha256 = "049xh75ifva83iw0xi5d06qrbrwj6rhdiwd971r939p80man6gim";
  };

  buildInputs = [ python ];

  nativeBuildInputs = [
    makeWrapper
    nodejs
    # REVIEW: why do we need this? ask @mjbrisebois
    ps
  ];

  packageJSON = "${src}/package.json";
  yarnLock = "${src}/yarn.lock";

  buildPhase = ''
    yarn build
  '';

  installPhase = ''
      mkdir $out
      mv node_modules $out
      cd deps/@holo-host/envoy/
      mv build server.js $out
      makeWrapper ${nodejs}/bin/node $out/bin/${name} \
        --add-flags $out/server.js
  '';

  fixupPhase = ''
    patchShebangs $out
  '';

  distPhase = '':'';

  # HACK: consider flipping it on when test timeout issues are resolved
  doCheck = false;
}
