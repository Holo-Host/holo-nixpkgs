{
  hpos = {
    rev = "bb744c964a0ed61a2a7db7c8ff0f540ec6df9578";
    sha256 = "1yzi3ra1808kdcjnv78zwrzihyfjpj5mllrgnjcfdhw334i9xgib";
    cargoSha256 = "0gv2zhslraxiq8v5644mxb2d1sl0md6i79rsjppcf0gi7n6pd6zi";
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
