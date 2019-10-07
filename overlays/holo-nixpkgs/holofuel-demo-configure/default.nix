{ stdenv, runCommand, makeWrapper, jq, holofuel-app, diceware, bc }:

runCommand "holofuel-demo-configure" { nativeBuildInputs = [ makeWrapper ]; } ''
  makeWrapper ${stdenv.shell} $out/bin/holofuel-demo-configure \
    --set HOLOFUEL_APP_UI_PATH ${holofuel-app} \
    --add-flags ${./holofuel-demo-configure.sh} \
    --prefix PATH : ${stdenv.lib.makeBinPath [ jq diceware bc ]}
''
