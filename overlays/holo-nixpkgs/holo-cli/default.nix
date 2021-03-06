{ stdenv, makeWrapper, gitignoreSource, jq, pkgs }:

with stdenv.lib;

{

  holo-cli = stdenv.mkDerivation rec {
    name = "holo";
    src = gitignoreSource ./.;

    nativeBuildInputs = [ makeWrapper ];

    installPhase = ''
      install -Dm 755 holo.sh $out/bin/${name}
      wrapProgram $out/bin/${name} \
      --prefix PATH : ${makeBinPath [ jq pkgs.hpos-holochain-client ]}
    '';

    meta.platforms = platforms.linux;

  };

}
