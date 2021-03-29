{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  hc-state-node = stdenv.mkDerivation rec {
    name = "hc-state-node";

    src = fetchFromGitHub {
      owner = "Holochain";
      repo = "hc-state-cli-node";
      rev = "dea84936f1a01c3ea4c141094e94707442833cee";
      sha256 = "04wxfwdilkk4b2s42r6zg4vlxrv1z4hd78yi3mj6jg08n2n535zj";
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
