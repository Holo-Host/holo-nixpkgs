{ stdenv, fetchFromGitHub, gitignoreSource, nodejs, npmToNix }:

stdenv.mkDerivation rec {
  name = "holo-cli";

  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-cli";
    rev = "6f568f590e7b23eda395e164faf6b8706dd3b7c0";
    sha256 = "1bj84fp4z1wh3yq03v9p8d5378favw8hxvrwhvkmhvld7nqd5p44";
  };

  nativeBuildInputs = [ nodejs ];

  preConfigure = ''
    cp -Lr ${npmToNix { inherit src; }} node_modules
    chmod -R +w node_modules
    patchShebangs node_modules
  '';

  buildPhase = ":";

  installPhase = ''
    mkdir $out
    mv * $out
  '';

  fixupPhase = ''
    patchShebangs $out
  '';
}

