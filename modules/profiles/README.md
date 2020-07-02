# HPOS Profiles

## Development profile

This profile provides features mostly relevant for HPOS developers.

To use it, enable it and necessary features in your `/etc/nixos/configuration.nix`:

```nix
# /etc/nixos/configuration.nix

{
  profiles.development = {
    enable = true;
    features = {
        # ...
    };
  };
}
```

### Features

- `overrideConductorConfig`: boolean, default = `false`

  When this feature is enabled, HPOS will no longer rewrite your `conductor-config.toml`
  on updates, meaning that all your changes will **NOT** be overwritten.
  
- `ssh.enable`: boolean, default = `false`

  Whether to allow *any* SSH access to your Holoport.
  
- `ssh.access.holoCentral`: boolean, default = `true`

  Whether to allow Holo Central team to access your Holoport.
  Does **not** allow access if `ssh.enable` is not `true`.
  
- `ssh.access.keys`: list of strings (SSH keys)

  Any additional SSH (RSA, ED25519, etc.) keys that are allowed to access your Holoport.

  Example:

  ```nix
  {
    features = {
      overrideConductorConfig = true;
      ssh = {
        enable = true;
        access = {
          holoCentral = false;
          keys = [
              "ssh-ed25519 <YOUR-ED25519-KEY-HERE>"
          ];
        };
      };
    };
  }
  ```
