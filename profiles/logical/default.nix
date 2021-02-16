{ lib, ... }:

{
  imports = [ ../. ];

  services.nginx = {
    recommendedOptimisation = lib.mkDefault true;
    recommendedProxySettings = lib.mkDefault true;
    recommendedTlsSettings = lib.mkDefault true;
  };

  users.mutableUsers = lib.mkDefault false;

  users.users.customerService =
    { isNormalUser = true;
      description = "Customer Service SSH keys";
      extraGroups = [ "wheel" ];
      openssh.authorizedKeys.keys = [ "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDVC8WfgtvzgCXqRxdUdJCG+PaLDZVXYeKKm5M6C/8mB" ];
    };
}
