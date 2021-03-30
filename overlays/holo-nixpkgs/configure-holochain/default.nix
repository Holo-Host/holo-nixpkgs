{ pkgs, rustPlatform  }:

with pkgs;

rustPlatform.buildRustPackage {
  name = "hpos-configure-holochain";
  src = fetchFromGitHub {
    owner = "Holo-Host";
    repo = "hpos-configure-holochain";
    rev = "151e78f63abb85639d383ad79f52398703d5c62e";
    sha256 = "0p8xhbxj1dfyfyzwz809nwbhhnhjxsflrd61v701a6l2g45i1593";
  };

  cargoSha256 = "00wn68ap8c2igc2acwldwd02wbkglbba19zdb3wsp78259dznpad";

  nativeBuildInputs = [ pkgconfig ];
  buildInputs = [ openssl ];

  meta.platforms = lib.platforms.linux;
}
