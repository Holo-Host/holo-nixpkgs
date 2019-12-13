{ makeTest, lib, holo-router-gateway }:

makeTest {
  name = "holo-router";
  
  nodes = {
     router = {
        imports = [ (import ../../profiles) ];

        documentation.enable = false;

        environment.systemPackages = [
          holo-router-gateway
        ];

        services.holo-router-gateway.enable = true;
      };
    dnsproxy2 = {
    
        imports = [ (import ../../profiles) ];

        documentation.enable = false;

        environment.systemPackages = [
          holo-router-gateway
        ];

        services.holo-router-gateway.enable = true;
    
    };
  };
  testScript = ''
    startAll;
    $router->systemctl("start holo-router-gateway.service");
    $router->waitForUnit("holo-router-gateway.service");
    $router->shutdown;
  '';

  meta.platforms = lib.platforms.linux;
}
