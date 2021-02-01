{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage  }:

{
  host-console-ui = mkYarnPackage rec {
    name = "host-console-ui";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "host-console-ui";
      rev = "13af8511cce1ea61fdddd5bd4f89526737871e2c";
      sha256 = "1cizp3kdhadyjp5v20jzygryjd2ylfx7x4n0c1vzbv5m6g2cfmr5";
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
