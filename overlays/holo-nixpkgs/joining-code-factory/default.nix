{ stdenv, fetchFromGitHub, mkYarnPackage }:

{
  joining-code-factory = mkYarnPackage rec {
    name = "joining-code-factory";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "joining-code-happ";
      rev = "a96bce045d53637b3893fc1e486ac5607fa84577";
      sha256 = "12fvyqmpqi4xmq2x5ydb92bdnilwnvb5d5iykzzl0g8ak2w2arjp";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
