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
    rev = "c5c79677978b6b8c7d966572144162535de127aa";
    sha256 = "0svhvix2zjsw56z9b2v39ji23r5cn4dmlyql3nx2vpxm02pgdzyb";
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
