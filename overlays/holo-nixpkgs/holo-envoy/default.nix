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
    rev = "91c7f742d3950e28414993176a5f0f8a13709d35";
    sha256 = "0pg1wx4w1ca7x5b3sjdqzb1fsgv6wfgw7wbzpg5ska645h7q65r9";
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
