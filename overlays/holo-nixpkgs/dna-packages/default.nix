final: previous:

with final;

let
  happ-store = fetchFromGitHub {
    owner = "holochain";
    repo = "happ-store";
    rev = "a7feb1f701753da2b0b3c1de9d6bc1c13896782b";
    sha256 = "17d94cwk4xgf6i2xx50bxyk1bq68dc1ps4hi9wjy7f1c2qclgfdy";
  };

in

{
  inherit (callPackage happ-store {}) happ-store;

}
