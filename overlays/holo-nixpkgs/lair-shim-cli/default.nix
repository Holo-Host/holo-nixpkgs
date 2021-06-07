{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  lair-shim-cli = stdenv.mkDerivation rec {
    name = "lair-shim-cli";

    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "lair-shim";
      rev = "cf0054e8c85a6b3f8c141aa76a463c341707914e";
      sha256 = "1rx76dkl878canwxx0q10hccp677knfr7d1zgvsrvm3y6inkn4p3";
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
