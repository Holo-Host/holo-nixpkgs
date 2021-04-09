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
, gitignoreSource
}:

mkYarnPackage rec {
  name = "holo-envoy";
  src = gitignoreSource /home/robbie/code/holo/holo-envoy;

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
