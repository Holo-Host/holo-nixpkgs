# systemd resilience test

The purpose of this test is to check if after failure of one of the services hosting infrastructure can spin up again and return to working state.

Hosting infrastructure on HPOS consists of holochain and four supporting services. There's strict dependence of one service on another therefore they have to start in the following order:
- lair-keystore
- holo-envoy
- hpos-holochain-api
- holochain
- configure-holochian

Each service has to restart automatically after a failure and cannot affect other services. Moreover holochain configuration set by `configure-holochain` has to remain intact throughout the crashes.