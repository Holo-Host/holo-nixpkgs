{ lib, gitignoreSource, rustPlatform, makeWrapper, pkgconfig, aorura-cli, openssl }:

rustPlatform.buildRustPackage {
  name = "hpos-led-daemon";
  src = gitignoreSource ./.;

  cargoSha256 = "1zkczz8wq6v7cfjvmk7hc1ghn1c7f7mmi760bl442im8r7qbcx5v";

  nativeBuildInputs = [ makeWrapper pkgconfig ];
  buildInputs = [ openssl ];

  postInstall = ''
    wrapProgram $out/bin/hpos-led-daemon \
      --prefix PATH : ${lib.makeBinPath [ aorura-cli ]}
  '';

  meta.platforms = lib.platforms.linux;
}
