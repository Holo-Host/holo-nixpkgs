{ buildGoPackage, fetchzip }:

buildGoPackage rec {
  name = "dnscrypt-proxy-${rev}";
  rev = "2.0.17";

  goDeps = ./deps.nix;
  goPackagePath = "github.com/jedisct1/dnscrypt-proxy";

  src = fetchzip {
    url = "https://${goPackagePath}/archive/${rev}.tar.gz";
    sha256 = "12mg1jbla2hyq44wq9009sqb0mzwq16wi8shafabwk0zf9s2944d";
  };
}
