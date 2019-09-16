{
  imports = [
    @profile@
    <holo-nixpkgs/profiles/holoportos>
    ./hardware-configuration.nix
  ];

  system.holoportos.network = "@network@";
}
