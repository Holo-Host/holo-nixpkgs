{ config, lib, pkgs, ... }: with lib;

let
  cfg = config.services.dnscrypt-proxy2;

  exportJSON = val:
    pkgs.writeText "export.json" (builtins.toJSON val);

  configFile = pkgs.runCommand "dnscrypt-proxy.toml" {} ''
    ${pkgs.remarshal}/bin/json2toml < ${exportJSON cfg.config} > $out
  '';
in

{
  options.services.dnscrypt-proxy2 = {
    enable = mkEnableOption "dnscrypt-proxy";

    config = mkOption {
      type = types.attrs;
    };

    package = mkOption {
      default = pkgs.dnscrypt-proxy2;
      type = types.package;
    };
  };

  config = mkIf cfg.enable {
    networking.nameservers = [ "127.0.0.1" ];

    systemd.services.dnscrypt-proxy2 = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        AmbientCapabilities = "CAP_NET_BIND_SERVICE";
        DynamicUser = true;
        ExecStart = "${cfg.package}/bin/dnscrypt-proxy -config ${configFile}";
      };
    };
  };
}
