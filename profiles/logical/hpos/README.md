# HPOS Profiles

Main HPOS profile (located in default.nix) sets up services for production ready HoloPort. Other profiles (located in subfolders) add certain functionality to HPOS:
- development - disables automatic rebuild of Holochain conductor configuration with each system restart
- sandbox - disables HPOS registration services and enables local sim2h server
- staged - enables ssh access to HPOS to users listed in `staged/authorized_keys`
