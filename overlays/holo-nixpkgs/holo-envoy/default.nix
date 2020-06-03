{ stdenv, rustPlatform, fetchFromGitHub, nodejs-12_x, npmToNix }:

stdenv.mkDerivation rec {
  name = "holo-envoy";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-envoy";
    rev = "a551e441ac966cf04c23453efba4e5191a78c7fb";
    sha256 = "1r6vjs3ycw4q3d23w3ik5zxcghqzks27147s78p4pg2gb0fxsvn0";
  };

  nativeBuildInputs = [ nodejs-12_x ];

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
    mv * $out
  '';

  fixupPhase = ''
    patchShebangs $out
  '';

  checkPhase = ''
    npm run test
  '';

  # HACK: consider flipping it on when test timeout issues are resolved
  doCheck = false;
}
