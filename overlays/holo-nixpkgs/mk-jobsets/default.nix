{ lib, writeText }: { owner, repo, branches, pullRequests ? null }:

let
  toJobset = { url, ref }: {
    checkinterval = 10;
    emailoverride = "";
    enabled = true;
    enableemail = false;
    hidden = false;
    inputs."${repo}" = {
      emailresponsible = false;
      type = "git";
      value = "${url} ${ref}";
    };
    keepnr = 65535;
    nixexprinput = repo;
    nixexprpath = "release.nix";
    schedulingshares = 100;
  };

  branchToJobset = ref: toJobset {
    url = "https://github.com/${owner}/${repo}.git";
    inherit ref;
  };

  pullRequestToJobset = n: pr: toJobset {
    url = "https://github.com/${pr.base.repo.owner.login}/${pr.base.repo.name}.git";
    ref = "pull/${n}/head";
  };

  jobsets =
    lib.mapAttrs pullRequestToJobset (if pullRequests != null then (lib.importJSON pullRequests) else {}) // lib.genAttrs branches branchToJobset;
in

{
  jobsets = writeText "jobsets.json" (builtins.toJSON jobsets);
}
