{ stdenv, makeWrapper, gitignoreSource, curl, jq, git, nix, perl }:

with stdenv.lib;

{

  hpos-update-cli = stdenv.mkDerivation rec {
    name = "hpos-update";
    src = gitignoreSource ./.;

    nativeBuildInputs = [ makeWrapper ];

    installPhase = ''
      install -Dm 755 hpos-update.sh $out/bin/${name}
      wrapProgram $out/bin/${name} \
      --prefix PATH : ${makeBinPath [ curl jq git nix perl ]}
    '';

    meta.platforms = platforms.linux;

  };

}
