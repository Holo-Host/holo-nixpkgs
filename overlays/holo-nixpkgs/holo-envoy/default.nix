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
    rev = "f0539c45aa2e2c3e8cec5b6e6247b5f1a16fe924";
    sha256 = "0crfsjc451xsh3ymmbv7ncki743k95n87l429ikvs6lh6kff1rrj";
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
