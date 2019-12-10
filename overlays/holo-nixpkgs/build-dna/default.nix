{ stdenv
, callPackage
, cargoToNix
, gitignoreSource
, npmToNix
, runCommand
, rustPlatform
, holochain-cli
, jq
, lld
, nodejs
, python2
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

  holochainRust = callPackage holochain-rust {};

  stripContext = stringWithContext: builtins.readFile (
    runCommand "string" {} ''
      echo -n "${stringWithContext}" > $out
    ''
  );

  this = runCommand name {} ''
    cp -r ${src} $out
    chmod +w $out
    ln -s ${holochain-rust} $out/holochain-rust
  '';

  testDir = "${this}/test";

  fetchZomeDeps = name: ''
    ln -s ${cargoToNix "${this}"} vendor # Expect Cargo.lock in root
  '';

  subDirNames = dir: attrNames
    (
      filterAttrs (name: type: type == "directory")
        (builtins.readDir dir)
    );
in

rustPlatform.buildRustPackage (
  {
    inherit name;

    nativeBuildInputs = nativeBuildInputs ++ [
      holochainRust.holochain-cli
      holochainRust.holochain-conductor
      holochainRust.sim2h-server
      jq
      lld
      nodejs
      python2
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

    preConfigure = fetchZomeDeps "${this}"; # concatStrings (map fetchZomeDeps (subDirNames "${this}/zomes"));

    #RUSTFLAGS = "-C linker=lld"; # Not required for Cargo.toml in root?

    buildPhase = ''
      runHook preBuild

      hc package

      runHook postBuild
    '';

    checkPhase = ''
      runHook preCheck

      cargo test

    '' + optionalString (pathExists (stripContext testDir)) ''
      cp -r ${npmToNix { src = testDir; }} test/node_modules
      # TODO: when "memory" tests are reliable, re-enable
      #APP_SPEC_NETWORK_TYPE=memory hc test \
      #    | ( node test/node_modules/faucet/bin/cmd.js || cat )
    '' + ''

      runHook postCheck
    '';

    inherit doCheck;

    installPhase = ''
      runHook preInstall

      mkdir -p $out/nix-support
      jq -cS < dist/${name}.dna.json > $out/${name}.dna.json
      echo "file binary-dist $out/${name}.dna.json" > $out/nix-support/hydra-build-products

      runHook postInstall
    '';
  }
)
