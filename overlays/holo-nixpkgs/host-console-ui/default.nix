{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "475f80fe3ef1214a704f5efeba2fc220a9729cc6";
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