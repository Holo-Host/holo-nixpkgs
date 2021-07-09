rec {
  networkList = {
    # Default network, must be defined
    alphaNet = {
      networkName = "alphaNet";
      zerotierNetworkID = "93afae5963c547f1";
      hposDomain = "holohost.net";
      routerRegistry = {
        stamp = "sdns://AgcAAAAAAAAADTEwNC4xNy4yNDEuNDUAGXJvdXRlci1yZWdpc3RyeS5ob2xvLmhvc3QNL3YxL2Rucy1xdWVyeQ";
        url = "https://router-registry.holo.host";
      };
      bootstrapUrl = "https://bootstrap.holo.host";
      proxy = rec {
        ipAddress = "45.55.107.33";
        port = "5788";
        pubKey = "f3gH2VMkJ4qvZJOXx0ccL_Zo5n-s_CnBjSzAsEHHDCA";
        certFile = "proxy.cert";
        kitsuneAddress = "kitsune-proxy://${pubKey}/kitsune-quic/h/${ipAddress}/p/${port}/--";
      };
      enforceHoloSsh = true;
    };

    devNet = {
      networkName = "devNet";
      zerotierNetworkID = "93afae5963c547f1";
      hposDomain = "holohost.dev";
      routerRegistry = {
        stamp = "sdns://AgcAAAAAAAAADTEwNC4xNy4yNDEuNDUAIGRldm5ldC1yb3V0ZXItcmVnaXN0cnkuaG9sby5ob3N0DS92MS9kbnMtcXVlcnk";
        url = "https://devnet-router-registry.holo.host";
      };
      bootstrapUrl = "https://devnet-bootstrap.holo.host";
      proxy = rec {
        ipAddress = "167.172.0.245";
        port = "5788";
        pubKey = "f3gH2VMkJ4qvZJOXx0ccL_Zo5n-s_CnBjSzAsEHHDCA";
        certFile = "proxy.cert";
        kitsuneAddress = "kitsune-proxy://${pubKey}/kitsune-quic/h/${ipAddress}/p/${port}/--";
      };
      enforceHoloSsh = true;
    };

    flexNet = {
      networkName = "flexNet";
      zerotierNetworkID = "93afae5963c547f1";
      hposDomain = "holohost.net";
      routerRegistry = {
        stamp = "sdns://AgcAAAAAAAAADTEwNC4xNy4yNDEuNDUAGXJvdXRlci1yZWdpc3RyeS5ob2xvLmhvc3QNL3YxL2Rucy1xdWVyeQ";
        url = "https://router-registry.holo.host";
      };
      bootstrapUrl = "https://devnet-bootstrap.holo.host";
      proxy = rec {
        ipAddress = "167.172.0.245";
        port = "5788";
        pubKey = "f3gH2VMkJ4qvZJOXx0ccL_Zo5n-s_CnBjSzAsEHHDCA";
        certFile = "proxy.cert";
        kitsuneAddress = "kitsune-proxy://${pubKey}/kitsune-quic/h/${ipAddress}/p/${port}/--";
      };
      enforceHoloSsh = true;
    };
  };

  selectNetwork = key:
    if networkList ? ${key} then networkList.${key} else networkList.alphaNet;
}
