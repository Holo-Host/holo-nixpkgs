{ lib, ... }:

{
  imports = [ ../.. ];

  # Anyone in this list is in a position to poison binary cache.
  users.users.root.openssh.authorizedKeys.keys = lib.mkForce [
    ''command="nix-store --serve --write" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE/SlkjHXwID8sIXRAkpqeB17S3J0ie27MXoVs8BTb5S''
  ];
}
