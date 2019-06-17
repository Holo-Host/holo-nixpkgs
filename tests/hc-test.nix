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
      $machine->waitForUnit('holochain.service');
      $machine->succeed('hc -V') =~ /0.0.19-alpha1/ or die;
    '';
}