{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  hc-state-node = stdenv.mkDerivation rec {
    name = "hc-state-node";

    src = fetchFromGitHub {
      owner = "Holochain";
      repo = "hc-state-cli-node";
      rev = "dd1f6439429f8271c0d7f4346da2e3ca512b0a36";
      sha256 = "0dzgklqgdyh9ia4sidr6zlx5jp0k2mxwwlg182yn4g24inlsaxyc";
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
