{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "b4a06ccb73a316fa5738084c809e0d5e8b26d7a0";
      sha256 = "10i95fkikrs1rdrp5z1bqydx290qlx435l89b8y2ipmnb4ixz46s";
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
