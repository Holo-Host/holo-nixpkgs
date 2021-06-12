{
  hpos = {
    rev = "d997f24134f230408273e841380b58441c95b343";
    sha256 = "0kp0m5klvpar7dl6a0rbhgjdynvhvshaspp7j2zw8c41mcz7dhvy";
    cargoSha256 = "083qs3f56rkfs8myxyggy23hl3kkm9fb5jwwgddrxrnnnjnx1cj5";
    bins = {
      holochain = "holochain";
      hc = "hc";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };

  develop = {
    rev = "78e2591449f1467f32b24219b4ffac75b6b840ee";
    sha256 = "10znmmxba2n74np8kriwwbk977x9asq7abbjz5w8angzi1nhibfm";
    cargoSha256 = "19faydkxid1d2s0k4jks6y6plgchdhidcckacrcs841my6dvy131";
    bins = {
      holochain = "holochain";
      hc = "hc";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };

  main = {
    rev = "a4461535c77f653f36cb3a7bb0dfda84e92ed1be";
    sha256 = "1kgxyfrwmga27mqywhivn0xdi6br90bavqvnd4kbrfyzbzmf8fcr";
    cargoSha256 = "1ix8ihlizjsmx8xaaxknbl0wkyck3kc98spipx5alav8ln4wf46s";
    bins = {
      holochain = "holochain";
      dna-util = "dna_util";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };
}
