{ stdenv, makeWrapper, gitignoreSource, jq, perl, git }:

with stdenv.lib;

{

  hpos-update-cli = stdenv.mkDerivation rec {
    name = "hpos-update";
    src = gitignoreSource ./.;

    nativeBuildInputs = [ makeWrapper ];

    installPhase = ''
      install -Dm 755 hpos-update.sh $out/bin/${name}
      wrapProgram $out/bin/${name} \
      --prefix PATH : ${makeBinPath [ jq git perl ]}
    '';

    meta.platforms = platforms.linux;

  };

}