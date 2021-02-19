{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "8b3f11cd7eab93583e5bc7a64707db1a2abb0a8b";
      sha256 = "10m83c8kxp0mn9xxsx5i1lagc25l0gxi0jkc1mzwdv4vjh11a3gl";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
