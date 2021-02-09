{ stdenv, gitignoreSource, mkYarnPackage }:

{
  hosted-happ-monitor = mkYarnPackage rec {
    name = "hosted-happ-monitor";
    src = gitignoreSource ./.;

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
