{ pkgs ? import ./. {} }:

with pkgs;

{
  holoportos = recurseIntoAttrs {
    qemu = buildImage ./profiles/holoportos/qemu;
    virtualbox = buildImage ./profiles/holoportos/virtualbox;
  };

  holoportos-installers = {
    holoport = buildImage ./profiles/holoportos-installers/holoport;
    holoport-nano = buildImage ./profiles/holoportos-installers/holoport-nano;
    holoport-plus = buildImage ./profiles/holoportos-installers/holoport-plus;
  };

  tests = recurseIntoAttrs {
    boot = import ./tests/boot.nix { inherit pkgs; };
    holo-init = import ./tests/holo-init.nix { inherit pkgs; };
    zerotier = import ./tests/zerotier.nix { inherit pkgs; };
  };
}
