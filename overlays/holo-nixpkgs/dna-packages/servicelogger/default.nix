{ callPackage, fetchFromGitHub }:

let
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "servicelogger";
    rev = "3b716c325e4243f5c88e2f65530cd6495a9f4ae5";
    sha256 = "03izll3b5ajgbw9b6df7vxc68ysxd4xzbrw2p41r9ybgmnn9bii8";
  };
in

(callPackage src {}).servicelogger.overrideAttrs (super: {
  doCheck = false;
})
