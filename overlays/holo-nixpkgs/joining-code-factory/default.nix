# { stdenv, fetchFromGitHub, mkYarnPackage }:

# {
#   joining-code-factory = mkYarnPackage rec {
#     name = "joining-code-happ";
#     src = fetchFromGitHub {
#       owner = "holo-host";
#       repo = "joining-code-happ";
#       rev = "a96bce045d53637b3893fc1e486ac5607fa84577";
#       sha256 = "0wx9s98h5gjb3ybc300113zvmzz0y03f5sb7vpp6pqbwy5hk57ac";
#       private = true;
#     };

#     packageJSON = "${src}/service/package.json";
#     # yarnLock = "${src}/service/yarn.lock";
#   };

#   buildPhase = ''
#     echo "BLAH!!!!
#   '';

#   installPhase = ''
#     mkdir $out
#     mv build/bundle.js $out
#   '';

# }

{ stdenv, nodejs, npmToNix, fetchFromGitHub }:

with stdenv.lib;
{
  joining-code-factory = stdenv.mkDerivation rec {
    name = "joining-code-happ";
    src = fetchFromGitHub {
        owner = "holo-host";
        repo = "joining-code-happ";
        rev = "a96bce045d53637b3893fc1e486ac5607fa84577";
        sha256 = "0wx9s98h5gjb3ybc300113zvmzz0y03f5sb7vpp6pqbwy5hk57ac";
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
      ls -l
      mkdir $out
      mv build/bundle.js $out
    '';

    meta.platforms = platforms.linux;
  };
}
