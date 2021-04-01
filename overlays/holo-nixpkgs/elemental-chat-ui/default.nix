{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage, dnaUUID, dnaVersion }:

{
  elemental-chat-ui = mkYarnPackage rec {
    name = "elemental-chat-ui";
    src = fetchFromGitHub {
      owner = "holochain";
      repo = "elemental-chat-ui";
      rev = "08341112d59223a2286f89171ad85e660df6bc6d";
      sha256 = "00vsa494hmjq5z1hq86gdaq7d29789fsf5i4nx9hqvv8a7srz27m";
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