{ pkgs, ...}:

{
  name = "hc-test";

  machine = { ... }: {
    imports = import ../modules/module-list.nix;
  };

  testScript =
    ''
      startAll;
      $machine->waitForUnit('holochain.service');
      $machine->succeed('hc -V') =~ /0.0.18-alpha1/ or die;
      $machine->succeed('holochain -V') =~ /0.0.18-alpha1/ or die;
      $machine->succeed('n3h -V') =~ /v0.0.13-alpha/ or die;
      $machine->shutdown;
    '';
}