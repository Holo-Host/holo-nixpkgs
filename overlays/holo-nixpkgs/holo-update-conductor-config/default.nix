{ lib, rustPlatform, fetchFromGitHub }:

rustPlatform.buildRustPackage {
  name = "holo-update-conductor-config";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-update-conductor-config";
    rev = "279577c589fdb3fa4ab2ec0ff2e2203be148de4f";
    sha256 = "017dxqlcmyjk85s0gbb16b4gkp4ndcyq932qdd1f4y67d9z0wsr1";
  };
  cargoSha256 = "03gj10cazbhvcdb8zbxbb9m0fz0bi537mk8a194ix6ygavnnyryq";

  meta.platforms = lib.platforms.linux;
  doCheck = false;
}