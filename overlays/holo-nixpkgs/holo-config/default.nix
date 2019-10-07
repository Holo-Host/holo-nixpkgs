{ callPackage, fetchFromGitHub }:

let
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "holo-config";
    rev = "6acfd9ed3d03d071094e040df879c8cbc8bcce06";
    sha256 = "1i9gv2vfz2rw0iwhalyd0jrsagnw978gh0rafwcsqk83rhby7zdh";
  };
in

(callPackage src {}).holo-config
