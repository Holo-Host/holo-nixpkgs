{ stdenv, fetchFromGitHub, nodejs, mkYarnPackage }:

{
  self-hosted-happs-node = mkYarnPackage rec {
    name = "self-hosted-happs-node";
    src = fetchFromGitHub {
      owner = "holo-host";
      repo = "self-hosted-happs-node";
      rev = "426cffa3a8779f34613cb0cea52f12274e665a02";
      sha256 = "0ycbyciqbqljvpfgqk55bqbyv6ngcngdyr1vy9xvczgx5xb0jkls";
    };

    buildPhase = ''
      yarn build
    '';

    installPhase = ''
      ls
    '';

    doCheck = false;
    meta.platforms = stdenv.lib.platforms.linux;
  };
}
