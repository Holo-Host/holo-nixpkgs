{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "1b18fe215ddcc92e8de47305109a85dd9c7e3981";
      sha256 = "0nfrkq2cj604yb35dy5cb4im4k0sz54m31n45xpkc0x3lrh0yzjg";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";

    buildPhase = ''
      yarn build
    '';

    installPhase = ''
      mv deps/host-console/dist $out
    '';

    distPhase = '':'';
  };
}