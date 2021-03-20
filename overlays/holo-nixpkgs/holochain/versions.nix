{
  hpos = {
    rev = "e157f64b67d5352cfba396b8088f90073879c8e0";
    sha256 = "1gffdlk2hmdjn54fg152yqfhmqqjcvfj2350ypnrir5cgjwj0369";
    cargoSha256 = "1yqk7vhw0j8y6zv8aimlr8phavsbzwxllqd1pvcmnkjmr1c1kzrm";
    bins = {
      holochain = "holochain";
      hc = "hc";
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
