{
  hpos = {
    rev = "1624c137b4172d533e93d744542198f38b6b7dfe";
    sha256 = "0fn08njj2rq8lfgnrggq35ssa24sncdhcmc34lc8hhwk26fcg65d";
    cargoSha256 = "1g9x6bb4pwigxwq1bg980rxr9y5p8m90q71gsq629b4x8ikw331v";
    bins = {
      holochain = "holochain";
      dna-util = "dna_util";
      kitsune-p2p-proxy = "kitsune_p2p/proxy";
    };
  };

  develop = {
    rev = "e89870cfb68645d656d432a9b50e7e7479542e67";
    sha256 = "0xn7s8ai6h11cz63yjdfs1spizqz36ngizyx371iygbmh2k9kvg6";
    cargoSha256 = "0h18qcs9jawmvc09k51bwx58fidqp3456hiz0pwk74122rbs5i7w";
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
