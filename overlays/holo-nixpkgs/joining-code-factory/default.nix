{ stdenv, nodejs, npmToNix, fetchFromGitHub }:

with stdenv.lib;
{
  joining-code-factory = stdenv.mkDerivation rec {
    name = "joining-code-happ";
    src = fetchFromGitHub {
        owner = "holo-host";
        repo = "joining-code-happ";
        rev = "c51210b076da26e91664e25a3d289281c97a969c";
        sha256 = "038i1dnqq6rhvzv3y52b7ryfngy52hhsxva68xx4d1jy1zphlnv7";
        private = true;
      };

    buildInputs = [ nodejs ];

    preConfigure = ''
      cp -r ${npmToNix { src = "${src}/service"; }} ./service/node_modules
      chmod -R +w ./service/node_modules
      patchShebangs ./service/node_modules
    '';

    buildPhase = ''
      cd ./service
      npm run build
    '';

    installPhase = ''
      mkdir $out
      mkdir $out/bin
      mkdir $out/libexec
      mkdir $out/libexec/${name}
      mv ./node_modules $out/libexec/${name}/node_modules
      mv build/bundle.js $out/bin
    '';

    meta.platforms = platforms.linux;
  };
}


