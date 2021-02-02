# Holo Nixpkgs

Modules, packages and profiles that drive Holo, Holochain, and HoloPortOS.

## Test suite

`holo-nixpkgs` provides a set of [NixOS tests](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests) found under [`/tests`](/tests).

### Running tests

To run all the tests, run the following command from repository root:

```sh
nix-build tests
```

To run a specific test, add `-A <test-directory>`, e.g.:

```sh
nix-build tests -A hpos-holochain-api
```

### Writing tests

[NixOS manual](https://nixos.org/manual/nixos/stable/index.html#sec-writing-nixos-tests) has a comprehensive entry on test syntax and available functions.

To add a new test:

1. Create a new file under `tests/<test-directory>/default.nix` using the following template:

<details>
<summary>default.nix template</summary>
  
```nix
{ makeTest, lib, hpos, /* additional packages */ ... }:

makeTest {
  name = "<test-name>";

  machine = {
    imports = [ (import "${hpos.logical}/sandbox") ];

    documentation.enable = false;

    environment.systemPackages = [
      # additional packages
    ];

    # Any test-specific NixOS configuration goes here
    # e.g. services.<name>.enable = true;

    virtualisation.memorySize = 3072;
  };

  testScript = ''
    start_all()
    
    # Your test script goes here
    # For syntax, consult NixOS manual on writing tests and other tests in /tests directory, e.g.
    # machine.succeed("command-to-test --foo bar")
  '';

  meta.platforms = [ "x86_64-linux" ];
}
```
  
</details>

2. Add a new attribute to the bottom-most block in [`/tests/default.nix`](/tests/default.nix), e.g.

```nix
{
  # <snip>
  test-name = callPackage ./<test-directory> {};
}
```

3. Make sure the test works by running it on a NixOS machine:

```sh
nix-build tests -A <test-name>
```

## Binary cache

On NixOS, add the following to `/etc/nixos/configuration.nix` and rebuild:

```nix
{
  nix.binaryCaches = [
    "https://cache.holo.host/"
  ];

  nix.binaryCachePublicKeys = [
    "cache.holo.host-1:lNXIXtJgS9Iuw4Cu6X0HINLu9sTfcjEntnrgwMQIMcE="
  ];
}
```

Otherwise, add `https://cache.holo.host/` to `substituters` and
`cache.holo.host-1:lNXIXtJgS9Iuw4Cu6X0HINLu9sTfcjEntnrgwMQIMcE=` to
`trusted-public-keys` in Nix config file:

```
substituters = https://cache.holo.host/ https://cache.nixos.org/
trusted-public-keys = cache.holo.host-1:lNXIXtJgS9Iuw4Cu6X0HINLu9sTfcjEntnrgwMQIMcE= cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=
```

For single-user installs (`nix-shell -p nix-info --run nix-info` prints
`multi-user: no`), Nix config file is in `~/.config/nix/nix.conf`.

Otherwise, for multi-user installs, Nix config file is in `/etc/nix/nix.conf`
and changing it requires root access.

## HoloPortOS

HoloportOS is an operating system based on [NixOS][nixos] that supports running
[Holochain][holochain] applications.

[holochain]: https://holochain.org
[nixos]: https://nixos.org

## Changing HPOS to Track `develop` vs. `master`

On your HoloPort or HPOS VM, the following command will alter your subscribed
nix channel.

To track `develop`:
- `nix-channel --add https://hydra.holo.host/channel/custom/holo-nixpkgs/develop/holo-nixpkgs`
- `nix-channel --update`
(change `develop` above to appropriate repo branch... e.g. `master`,
`staging`)

Your HoloPort or HPOS VM should now upgrade to your desired channel at the next
auto-upgrade interval.

To begin the upgrade immediately, use the following command:
- `systemctl start holo-nixpkgs-auto-upgrade.service`

### QEMU

If you have Nix installed, checkout the repo, enter `nix-shell` and then run
`hpos-shell`. That will launch a HoloPortOS VM against current state of your
local checkout, which is useful for iterative development.

### VirtualBox

Download the latest HoloPortOS VirtualBox OVA:
https://hydra.holo.host/job/holo-nixpkgs/master/holoportos.targets.virtualbox.x86_64-linux/latest/download-by-type/file/ova

Refer to [VirtualBox manual, chapter 1, section 1.15.2](https://www.virtualbox.org/manual/ch01.html#ovf-import-appliance).

## HPOS profiles

There's a number of profiles you can activate on your HPOS that alter behavior of your machine. Instructions, list of profiles and their features can be found in `profiles/logical/hpos/README.md`.
