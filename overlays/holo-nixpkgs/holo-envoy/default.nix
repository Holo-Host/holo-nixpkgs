{ stdenv
, rustPlatform
, fetchFromGitHub
, makeWrapper
, nodejs
, mkYarnPackage
, ps
, python
, fetchgit
}:

mkYarnPackage rec {
  name = "holo-envoy";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-envoy";
    rev = "659f37de20726473740b93fcf49cbd7d1d4f20da";
    sha256 = "1hjq7n5dn2y4x8kfz50fagl4hjn3cf18a9jzsz5zh20p6y1zzcj2";
  };

  extraBuildInputs = [ python ];

  nativeBuildInputs = [
    makeWrapper
    nodejs
    # REVIEW: why do we need this? ask @mjbrisebois
    ps
  ];

  buildPhase = ''
    yarn build
  '';

  installPhase = ''
      mkdir $out
      mv build node_modules rpc-websocket-wrappers server.js $out
      makeWrapper ${nodejs}/bin/node $out/bin/${name} \
        --add-flags $out/server.js
  '';

  fixupPhase = ''
    patchShebangs $out
  '';

  checkPhase = ''
      make test-nix
      make stop-sim2h
  '';

  # HACK: consider flipping it on when test timeout issues are resolved
  doCheck = false;
}
