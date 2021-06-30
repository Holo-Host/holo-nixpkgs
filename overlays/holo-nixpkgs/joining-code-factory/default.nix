{ stdenv, fetchFromGitHub, mkYarnPackage }:

{
  joining-code-factory = mkYarnPackage rec {
    name = "joining-code-factory";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "joining-code-happ";
      rev = "413ba6c6e006a3d080e7b287853bf356b62d17f3";
      sha256 = "02fvyqmpqi4xmq2x5ydb92bdnilwnvb5d5iykzzl0g8ak2w2arjp";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
