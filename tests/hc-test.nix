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
      $machine->waitForUnit('envoy.service');
      $machine->waitForUnit("multi-user.target");
      $machine->succeed('hc -V') =~ /0.0.24-alpha2/ or die;
      $machine->succeed('holochain -V') =~ /0.0.24-alpha2/ or die;
      $machine->succeed('n3h -V') =~ /v0.0.17-alpha/ or die;
      $machine->shutdown;
    '';
}