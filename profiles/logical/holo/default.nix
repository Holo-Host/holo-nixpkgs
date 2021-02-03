{ lib, ... }:

{
  imports = [
    ../.
    ../binary-cache.nix
    ../self-aware.nix
  ];

  time.timeZone = "UTC";

  # Anyone in this list is in a position to poison binary cache, commit active
  # MITM attack on hosting traffic, maliciously change client assets to capture
  # users' keys during generation, etc. Please don't add anyone to this list
  # unless absolutely required. Once U2F support in SSH stabilizes, we will
  # require that everyone on this list uses it along with a hardware token. We
  # also should set up sudo_pair <https://github.com/square/sudo_pair>.
  users.users.root.openssh.authorizedKeys.keys = lib.mkForce [
    # Br1ght0ne
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICp5OkzJW/6LQ1SYNTZC1hVg72/sca2uFOOqzZcORAHg"
    # PJ Klimek
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJwtG0yk6e0szjxk3LgtWnunOvoXUJIncQjzX5zDiKxY"
    # Alastair Ong
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDVC8WfgtvzgCXqRxdUdJCG+PaLDZVXYeKKm5M6C/8mB"
  ];
}
