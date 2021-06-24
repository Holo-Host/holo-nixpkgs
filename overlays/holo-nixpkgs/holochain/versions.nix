{
  hpos = {
    rev = "24ceb63bdea374d1936b723e1966caf2e55ebfdc";
    sha256 = "16hsikyasi0zbh7gfrpzlahydx7csnvshz421sx56f0jpwvi2g80";
    cargoSha256 = "0w29y8w5k5clq74k84ksj5aqxbxhqxh2djhll6vv694djw277rpj";
    bins = {
      holochain = "holochain";
      hc = "hc";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };

  develop = {
    rev = "7c69564deeef4cf81cc9997c62947eaec17ee629";
    sha256 = "0gdqj5m107c8yshi1i347q0xy3ssfdwd5590w0iyqa0rfmdlyihk";
    cargoSha256 = "1s60gzhgfi6gcg1pan9a4msfl0whsnw8gfnh6sjwdjldyzl17s87";
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
