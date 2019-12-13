{ stdenv
, callPackage
, cargoToNix
, gitignoreSource
, npmToNix
, runCommand
, rustPlatform
, holochain-cli
, nodejs
, which
}:

{ name, src, nativeBuildInputs ? [], doCheck ? true, shell ? false }:

with stdenv.lib;

let
  holochain-rust =
    let
      res = builtins.tryEval <holochain-rust>;
    in
      if res.success
      then gitignoreSource <holochain-rust>
      else holochain-cli.src;

  holochain-rust-shell =
    let
      res = builtins.tryEval <holochain-rust>;
    in
      if res.success
      then toString <holochain-rust>
      else holochain-cli.src;

  holochainPackages = callPackage holochain-rust {};

  this = runCommand name {} ''
    cp -r ${src} $out
    chmod +w $out
    ln -s ${holochain-rust} $out/holochain-rust
  '';
in

rustPlatform.buildRustPackage (
  {
    inherit name;

    nativeBuildInputs = nativeBuildInputs ++ [
      holochainPackages.holochain-cli
      holochainPackages.holochain-conductor
      holochainPackages.sim2h-server
      nodejs
      which
    ];

    cargoVendorDir = "vendor";
  } // optionalAttrs shell {
    shellHook = ''
      rm -f holochain-rust
      ln -s ${holochain-rust-shell} holochain-rust
    '';
  } // optionalAttrs (shell == false) {
    src = this;

    preConfigure = ''
      ln -s ${cargoToNix this} vendor
    '';

    buildPhase = ''
      runHook preBuild

      hc package

      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall

      mv dist $out
      mkdir -p $out/nix-support
      echo "file binary-dist $out/${name}.dna.json" > $out/nix-support/hydra-build-products

      runHook postInstall
    '';

    meta.platforms = [ "x86_64-linux" ];
  }
)
