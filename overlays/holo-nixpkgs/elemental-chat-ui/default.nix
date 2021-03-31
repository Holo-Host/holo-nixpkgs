{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage, dnaUUID, dnaVersion }:

{
  elemental-chat-ui = mkYarnPackage rec {
    name = "elemental-chat-ui";
    src = fetchFromGitHub {
      owner = "holochain";
      repo = "elemental-chat-ui";
      rev = "f72e7edf2618a63a16f7ad6271167b8a5c6f05bd";
      sha256 = "023b7jgv67yv9b0ms9qw5c17ckz5k44kgyiasdrrg3wk7389b619";
    };

    packageJSON = "${src}/package.json";
    yarnLock = "${src}/yarn.lock";

    buildPhase = ''
      sed -i "s/const DNA_UUID = '.*'/const DNA_UUID = ${dnaUUID}/" src/consts.js
      sed -i "s/const DNA_VERSION = '.*'/const DNA_VERSION = ${dnaVersion}/" src/consts.js
      yarn build:self-hosted
    '';

    installPhase = ''
      cd deps/host-console/dist
      rm service-worker.js
      zip -r elemental-chat.zip .
      mv elemental-chat.zip $out/elemental-chat-for-dna-${dnaVersion}-${dnaUUID}.zip
    '';

    distPhase = '':'';
  };
}