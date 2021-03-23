{
  hpos = {
    rev = "a82372a62d46a503e48f345360d0fb18cc5822d1";
    sha256 = "1flz7cqm2rpnchsnfai83vw65m57x69ajrhd8v5zgnjcnc1plymx";
    cargoSha256 = "1fpkb3ga1f4xvgazpd31v45y4gbf6ss1y1rjzqx300vlp99237f9";
    bins = {
      holochain = "holochain";
      hc = "hc";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };

  develop = {
    rev = "2136a1f09f8ac7c48773c658bc7312ab46e992cb";
    sha256 = "1fpmqd9xrjxg228lvc9q660dgf215xkijdazgxa172d5jllqsssq";
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
