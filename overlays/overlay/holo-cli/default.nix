{ stdenv, buildGoPackage, fetchgit, fetchhg, fetchbzr, fetchsvn }:

buildGoPackage rec {
  name = "holo-cli-unstable-${version}";
  version = "2019-05-15";
  rev = "6a8fd11370fff45fdb763198a67cb79c86e1efe3";

  goPackagePath = "github.com/Holo-Host/holo-cli";

  src = fetchgit {
    inherit rev;
    url = "https://github.com/Holo-Host/holo-cli";
    sha256 = "12rck2d1gz56y69wycy2jf7dp9qaf47bdi6gfb15kr3rarigvy69";
  };

  goDeps = ./deps.nix;

  meta = with stdenv.lib; {
    description = "holo-cli";
    homepage    = https://github.com/Holo-Host/holo-cli;
    license     = licenses.free;
    platforms   = platforms.unix;
    maintainers = [ maintainers.samrose ];

  };
}
