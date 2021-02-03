{ stdenv,  nodejs, npmToNix, gitignoreSource }:

{
  hpos-holochain-api = stdenv.mkDerivation rec {
    name = "hpos-holochain-api";
    src = gitignoreSource ./.;

    buildInputs = [ nodejs ];

    preConfigure = ''
      cp -r ${npmToNix { src = "${src}/"; }} node_modules
      chmod -R +w node_modules
      chmod +x node_modules/.bin/webpack
      patchShebangs node_modules
    '';

    buildPhase = ''
      npm run build
    '';

    installPhase = ''
      cp -r dist/ $out
    '';

    doCheck = false;
    meta.platforms = stdenv.lib.platforms.linux;
  };
}
