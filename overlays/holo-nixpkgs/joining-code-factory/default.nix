{ stdenv, gitignoreSource, mkYarnPackage }:

{
  joining-code-factory = mkYarnPackage rec {
    name = "joining-code-factory";
    src = gitignoreSource ./joining-code-happ/service;

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
