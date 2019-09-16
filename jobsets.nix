{ pkgs ? import ./. {} }:

with pkgs;

let
  pullRequests = lib.importJSON <holo-nixpkgs-pull-requests>;

  sharedJobset = {
    checkinterval = 10;
    emailoverride = "";
    enabled = true;
    enableemail = false;
    hidden = false;
    keepnr = 512;
    nixexprinput = "holo-nixpkgs";
    nixexprpath = "release.nix";
  };

  branchJobset = ref: sharedJobset // {
    inputs.holo-nixpkgs = {
      emailresponsible = false;
      type = "git";
      value = "https://github.com/Holo-Host/holo-nixpkgs.git ${ref}";
    };
    schedulingshares = 60;
  };

  pullRequestToJobset = n: pr: sharedJobset // {
    inputs.holo-nixpkgs = {
      emailresponsible = false;
      type = "git";
      value = "https://github.com/${pr.base.repo.owner.login}/${pr.base.repo.name} pull/${n}/head";
    };
    schedulingshares = 20;
  };

  jobsets = lib.mapAttrs pullRequestToJobset pullRequests // {
    develop = branchJobset "develop";
    staging = branchJobset "staging";
    master = branchJobset "master";
  };
in

{
  jobsets = pkgs.writeText "jobsets.json" (builtins.toJSON jobsets);
}
