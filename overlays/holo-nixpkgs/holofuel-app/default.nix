{ stdenv, fetchFromGitHub, nodejs, npmToNix, hclient }:

stdenv.mkDerivation rec {
  name = "holofuel-app";

  src = fetchFromGitHub {
    owner = "mjbrisebois";
    repo = "holofuel-app";
    rev = "e12b5327000373c270d2f5cd067808e0df10cb50";
    sha256 = "0xf920v0xl2mxqah8s98fh0y55ck1wzl6i5rma0l9hhxd0m1amkr";
  };

  nativeBuildInputs = [ nodejs ];

  preConfigure = ''
    cp -r ${npmToNix { inherit src; }} node_modules
    chmod -R +w node_modules
    patchShebangs node_modules
  '';

  buildPhase = ''
    ln -fs ${hclient}/hclient-${hclient.version}.browser.min.js js/hClient.js
    node node_modules/webpack/bin/webpack.js
  '';

  installPhase = ''
    mkdir $out
    mv * $out
  '';

  fixupPhase = ''
    patchShebangs $out
  '';
}
