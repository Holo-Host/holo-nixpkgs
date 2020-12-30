{ stdenv, python3Packages, fetchFromGitHub }:



python3Packages.buildPythonApplication rec {
  name = "matching-engine";
  src = fetchFromGitHub {
      owner = "Holo-Host";
      repo = "matching-engine";
      rev = "a1a58b5eb5e3790d9ccad6d4f026a740548ae65c";
      sha256 = "1kh9ibbjwp0jsqgggf5qkvl0k4c73r7610nda09wrx4ih2gjladc";
      private = true;
    };

  checkInputs = with python3Packages; [ pytest requests-mock ];
  propagatedBuildInputs = with python3Packages; [ requests pandas pymongo numpy ];

  checkPhase = ''
    pytest
  '';

  # meta.platforms = platforms.linux;
}
