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
    rev = "98df4dd5c58a7111dbae3bcb5e8579a0f09f7e8b";
    sha256 = "19a4cwd4adcdk4ni605fksvm5mhgz53qxf94f0f4ds3858wq5kcd";
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
