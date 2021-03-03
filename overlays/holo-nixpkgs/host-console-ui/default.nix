{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "6e3815227b5ffc1cc4cff6537368a620ff8d328e";
      sha256 = "0cz1hb3nxzxxi7nf0sr5cdnigqjnb9khd502xvmxy4nk2b4x4v67";
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