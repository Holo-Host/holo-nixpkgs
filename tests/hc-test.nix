{ pkgs, ...}:

{
  name = "hc-test";

  machine = { ... }: {
    imports = import ../modules/module-list.nix;
  };

  testScript =
    ''
      startAll;
      $machine->waitForUnit("multi-user.target");
      $machine->succeed('hc -V | grep 0.0.18-alpha1');
    '';
}