{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  lair-shim-cli = stdenv.mkDerivation rec {
    name = "lair-shim-cli";

    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "lair-shim";
      rev = "0d518aa2cc84e5213cfd383b79621d3d94b68fde";
      sha256 = "1yfxdxni8p9fkky23h8nm08qwvax0rlz1969ww7cyqv0sq3zdim7";
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
