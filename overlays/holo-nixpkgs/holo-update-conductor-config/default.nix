{ lib, rustPlatform, fetchFromGitHub }:

rustPlatform.buildRustPackage {
  name = "holo-update-conductor-config";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-update-conductor-config";
    rev = "0125704cb6fc227e82994b0627b677c1cd4c49e1";
    sha256 = "1820hrly2mwp4vqk1ik7j0zx2rqx3skbjniy60lclr1niamz0rvq";
  };
  cargoSha256 = "0djkhjy32kpmxm6gyq39a8jjqs272fw4pn1dnsajh7wnm9rnnzn0";

  meta.platforms = lib.platforms.linux;
  doCheck = false;
}