{ stdenv, fetchFromGitHub, nodejs, npmToNix }:

{
  self-hosted-happs-node = stdenv.mkDerivation rec {
    name = "self-hosted-happs-node";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "self-hosted-happs-node";
      rev = "c0a5bcecbb6034a1ae872094920f08e048f748cf";
      sha256 = "0vfqxk0ry3wm7z6d9a3fz5wyqnbbi7ylwnxavj27zlwshkhp0h09";
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
