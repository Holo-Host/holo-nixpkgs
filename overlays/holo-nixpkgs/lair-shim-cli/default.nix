{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  lair-shim-cli = stdenv.mkDerivation rec {
    name = "lair-shim-cli";

    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "lair-shim";
      rev = "180d3c35b738571f953eb39bdbc0205d237d9e40";
      sha256 = "0igq9pv7w6laxb4qf9riwz5p655ardnzk607a9m4px5x8igcj323";
    };

    buildInputs = [ nodejs ];

    preConfigure = ''
      cp -r ${npmToNix { src = "${src}/"; }} node_modules
      chmod -R +w node_modules
      chmod +x node_modules/.bin/webpack
      patchShebangs node_modules
    '';

    buildPhase = ''
      :
    '';

    installPhase = ''
      mkdir $out
      mv * $out
    '';

    doCheck = false;
    meta.platforms = stdenv.lib.platforms.linux;
  };
}