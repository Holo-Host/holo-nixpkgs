{ stdenv, gitignoreSource, fetchFromGitHub, mkYarnPackage }:

{
  lair-shim-cli = mkYarnPackage rec {
    name = "lair-shim-cli";

    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "lair-shim";
      rev = "180d3c35b738571f953eb39bdbc0205d237d9e40";
      sha256 = "0igq9pv7w6laxb4qf9riwz5p655ardnzk607a9m4px5x8igcj323";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";
  };
}