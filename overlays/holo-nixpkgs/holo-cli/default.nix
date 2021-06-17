{ stdenv, makeWrapper, gitignoreSource, jq, perl, git }:

with stdenv.lib;

{

  holo-cli = stdenv.mkDerivation rec {
    name = "holo";
    src = gitignoreSource ./.;

    nativeBuildInputs = [ makeWrapper ];

    installPhase = ''
      install -Dm 755 holo.sh $out/bin/${name}
      wrapProgram $out/bin/${name} \
      --prefix PATH : ${makeBinPath [ jq hpos-holochain-client ]}
    '';

    meta.platforms = platforms.linux;

  };

}
