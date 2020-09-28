{ stdenv
, rustPlatform
, fetchFromGitHub
, dnaPackages
, holochain-rust
, makeWrapper
, nodejs
, npmToNix
, ps
, python
, fetchgit
}:

stdenv.mkDerivation rec {
  name = "holo-envoy";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-envoy";
    rev = "ab160be627604d151d34e4b847fe3bdf13650ea0";
    sha256 = "1sy2d9zw37s100zpdwidv3cnkg919ff32p5sqp7r26idsqairqci";
  };

  buildInputs = [
    holochain-rust
    python
  ] ++ (with dnaPackages; [
    happ-store
    holo-hosting-app
    hosted-holofuel
    # holofuel
    servicelogger
  ]);

  nativeBuildInputs = [
    makeWrapper
    nodejs
    # REVIEW: why do we need this? ask @mjbrisebois
    ps
  ];

  preConfigure = ''
    cp -r ${npmToNix { inherit src; }} node_modules
    chmod -R +w node_modules
    patchShebangs node_modules
  '';

  buildPhase = ''
    npm run build
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
