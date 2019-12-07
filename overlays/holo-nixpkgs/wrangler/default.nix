{ stdenv
, fetchFromGitHub
, rustPlatform
, pkg-config
, curl
, darwin
, openssl
}:

with stdenv.lib;

rustPlatform.buildRustPackage rec {
  pname = "wrangler";
  version = "1.6.0";

  src = fetchFromGitHub {
    owner = "cloudflare";
    repo = "wrangler";
    rev = "v" + version;
    sha256 = "1rbjjyax6w87xdq722rndp3lhx9v70fcj8a9d6pbm9ys2x8r4xqs";
  };

  cargoSha256 = "1qw969vh3img92rw0wc0c768gysv2g5a0wr4qsdvbww4j61j4vsz";

  nativeBuildInputs = [ pkg-config ];

  buildInputs = [ curl openssl ] ++ optionals stdenv.isDarwin (
    with darwin.apple_sdk.frameworks; [
      CoreServices
      Security
    ]
  );

  doCheck = false;

  meta = {
    description = "CLI tool designed for folks who are interested in using Cloudflare Workers.";
    homepage = "https://github.com/cloudflare/wrangler";
    license = with licenses; [ asl20 mit ];
    platforms = platforms.all;
  };
}
