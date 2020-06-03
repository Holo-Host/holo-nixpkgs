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
}:

stdenv.mkDerivation rec {
  name = "holo-envoy";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-envoy";
    rev = "a551e441ac966cf04c23453efba4e5191a78c7fb";
    sha256 = "1r6vjs3ycw4q3d23w3ik5zxcghqzks27147s78p4pg2gb0fxsvn0";
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
