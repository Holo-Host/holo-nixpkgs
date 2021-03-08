{ stdenv, gitignoreSource, mkYarnPackage }:

{
  hosted-happ-monitor = mkYarnPackage rec {
    name = "joining-code-factory";
    src = gitignoreSource ./joining-code-happ/service;

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
