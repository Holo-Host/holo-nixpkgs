{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  hc-state-node = stdenv.mkDerivation rec {
    name = "hc-state-node";

    src = fetchFromGitHub {
      owner = "Holochain";
      repo = "hc-state-cli-node";
      rev = "1d616afa67181283bb9bd6ba27a297c2c97665d7";
      sha256 = "0y8q8j846z5bjh491xal2pyqzdbr9r2v54dzc5bzwh52dp8qwlmf";
    };

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
