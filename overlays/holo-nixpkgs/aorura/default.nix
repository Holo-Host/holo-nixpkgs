{ pkgs }: with pkgs;

let
  inherit (rust.packages.nightly) rustPlatform;
in

{
  aorura = buildRustPackage rustPlatform {
    name = "aorura";
    src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "aorura";
      rev = "2aef90935d6e965cf6ec02208f84e4b6f43221bd";
      sha256 = "00d9c6f0hh553hgmw01lp5639kbqqyqsz66jz35pz8xahmyk5wmw";
    };

    cargoSha256 = "0bvd872z8xnld1wkgrhlnh6rn0phzazx67ldp6whwjlgnii1f1zr";

  };
}