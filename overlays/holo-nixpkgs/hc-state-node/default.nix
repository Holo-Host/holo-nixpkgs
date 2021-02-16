{ stdenv,  nodejs, npmToNix, fetchFromGitHub }:

{
  hc-state-node = stdenv.mkDerivation rec {
    name = "hc-state-node";

    src = fetchFromGitHub {
      owner = "Holochain";
      repo = "hc-state-cli-node";
      rev = "0da0c0954e2314d507dce0bcfe6d30ff97321a62";
      sha256 = "1p8mbcna6ijhwxmjggqr2w7nqzm5lgslxi2a8lr0nqp9wxclr955";
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
