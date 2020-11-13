{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "30eb3a92fb62c53ce2628d333f71bef87b5c6916";
      sha256 = "1zn5k8spzls7p8iaf58fplwifbghxfs7gkm2vgfq0p6dsnsvvgpx";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
