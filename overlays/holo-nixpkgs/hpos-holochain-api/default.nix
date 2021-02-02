{ stdenv, gitignoreSource, mkYarnPackage }:

{
  hpos-holochain-api = mkYarnPackage rec {
    name = "hpos-holochain-api";
    src = gitignoreSource ./.;

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}
