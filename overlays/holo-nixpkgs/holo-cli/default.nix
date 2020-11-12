{ stdenv, fetchFromGitHub, gitignoreSource, nodejs, mkYarnPackage }:

stdenv.mkDerivation rec {
  name = "holo-cli";

  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-cli";
    rev = "172b55901c4a0c4083e3fe76ee9ef2b8867ef44f";
    sha256 = "1b8md3arzgmgp3vm82z6rwrpra7412gpsik8vxlvbfwa8y6zaws8";
  };

  buildPhase = ":";

  installPhase = ''
    mkdir $out
    mv * $out
    patchShebangs $out
  '';
}

# patchShebangs not working!