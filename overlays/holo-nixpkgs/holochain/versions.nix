{
  hpos = {
    rev = "ddb7d8d9310d1e6cf4cdc198c0c765ea5d70b9e0";
    sha256 = "1rbhxxh3z8kf17lj8w6dp5vj2rrkaqvxv2m6lxi74fxla5i5ar7f";
    cargoSha256 = "14979svzr4rklxz13a281c9qa8i5q0472bcfijj8hyrhfnvnzg2p";
    bins = {
      holochain = "holochain";
      hc = "hc";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };

  develop = {
    rev = "82a1e13b1b7a64d0663a5aaedd3fc0bca75e978a";
    sha256 = "sha256:1vnq5kjnxh80a67fpzps502p19q6r06kcbjib0sijv4h25jfrich";
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
