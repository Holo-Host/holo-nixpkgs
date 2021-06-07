{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  lair-shim-cli = stdenv.mkDerivation rec {
    name = "lair-shim-cli";

    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "lair-shim";
      rev = "25db2b720f76af9b4c7d74bfecc9c51bcaa0707d";
      sha256 = "0948w4gfivabbq6gch2zrlf2ingc90szalvv0xgz0j5sa1nh6pmc";
    };

    buildInputs = [ nodejs ];

    preConfigure = ''
      cp -r ${npmToNix { src = "${src}/"; }} node_modules
      chmod -R +w node_modules
      chmod +x node_modules/.bin/webpack
      patchShebangs node_modules
    '';

    buildPhase = ''
    '';

    installPhase = ''
    '';

    doCheck = false;
    meta.platforms = stdenv.lib.platforms.linux;
  };
}
