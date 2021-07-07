{ stdenv, gitignoreSource, mkYarnPackage }:

{
  test-hp-manager = mkYarnPackage rec {
    name = "test-hp-manager";
    src = gitignoreSource ./.;

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";

    fixupPhase = ''
      chmod -R +x $out
    '';
  };
}
