let
  nixpkgs = import ../../../../../nixpkgs/src;
in

{
  imports = [
    ../.
    "${nixpkgs}/nixos/modules/virtualisation/virtualbox-image.nix"
  ];

  virtualbox.memorySize = 3072;

  virtualisation.virtualbox.guest.x11 = false;
}
