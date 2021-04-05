let mockGithub = {
  holochain: {
    repos: {}
  },
  "holo-host": {
    repos: {}
  }
}
let mockGit = {}

const cmd = (cmd) =>{
  console.log(`MOCK COMMAND: ${cmd}`)
}

const checkoutOrCreateBranch = (github, repo, branch) => {

  if (!mockGit[repo]) {
    console.log(`${repo}: cloning`)
    cmd(`git clone "https://github.com/${github}/${repo}`)
  }
  cmd(`cd ${repo}`)

  if (!mockGithub[github].repos[repo]) {
    console.log(`${repo}: creating branch ${branch}`)
    cmd(`git checkout -b ${branch}`)
    mockGithub[github].repos[repo] = {branches: {}}
    mockGithub[github].repos[repo].branches[branch] = 0
  } else {
    console.log(`${repo}: found branch ${branch}, checking out`)
    cmd(`git checkout ${branch}`)
  }
}

const execUpdateFor = (github, repo, branch, dep, rev) => {
  console.log(`${repo}: updating ${dep} to rev ${rev}`)
  cmd(`scripts/bump.sh ${dep} ${rev}`)

  mockGithub[github].repos[repo].branches[branch]+=1
  let newRev = mockGithub[github].repos[repo].branches[branch]
  console.log(`${repo}: commit yields new rev ${newRev}`)
  cmd(`git commit -am "Bump ${dep} to ${rev}`)
  return newRev
}
const pushPullRequest = (github, repo, branch) => {
  console.log(`${repo}: looking for branch ${branch}`)
  cmd(`github pull-request ${branch}`) //TODO what's the github api for making a PR branch idempotently
  cmd(`git push`)
}

const awaitCI = (repo, branch) => {
  console.log(`${repo}: waiting for CI`)
  return true
}
const bumpRepo = (dep, github, repo, branch, rev) => {
  // idempotently clone repo, and create branch for bump
  checkoutOrCreateBranch(github, repo, branch)
  // run the local update script for the named dependency
  const newRev = execUpdateFor(github, repo, branch, dep, rev)
  // idempotently create a PR on the repo for the branch with the update
  pushPullRequest(github, repo, branch)
  // wait for
  if (!awaitCI(repo, branch)) {
    throw(`CI failed for ${dep} in ${repo}`)
  }
  return newRev
}

const bump = (dep, branch, rev) => {
  const repos = gatherRepos(dep)
  let deps = {}

  for (const [repo, github] of Object.entries(repos)) {
    // bump a repo and save the rev as a dependency
    deps[repo] = bumpRepo(dep, github, repo, branch, rev)
  }

  // recursively bump any other deps
  for (const [subDep, subRev] of Object.entries(deps)) {
    bump(subDep, branch, subRev)
  }

}

const matchDeps = (dep, spec) => {
  return spec.deps.includes(dep)
}

const gatherRepos = (dep) => {
  console.log(`Gathering repos for: ${dep}`)
  let repos = {}
  for (const spec of depSpecs) {
    if (matchDeps(dep, spec)) {
      if (spec.multi) {
        for (const repo of spec.repos) {
          const [github, r] = repo.split("/")
          repos[r] = github
        }
      } else {
        const [github, repo] = spec.repo.split("/")
        repos[repo] = github
      }
    }
  }
  console.log(`Found:`, repos)
  return repos
}

const depSpecs = [
  {
    repo: "holochain/holochain-conductor-api",
    deps: ["holochain:api"]
  },
  {
    repo: "holochain/tryorama",
    deps: ["holochain:hdk", "holochain-conductor-api" ]
  },
  {
    repo: "holo-host/holo-nixpkgs",
    deps: ["holochain:*", "hpos-configure-holochain"]
  },
  {
    multi: "dna",
    repos: ["holochain/elemental-chat", "holo-host/service-logger", "holo-host/holofuel", "holo-host/hha"],
    deps: ["holochain:hdk", "tryorama"]
  },
  {
    multi: "ui",
    repos: ["holochain/elemental-chat-ui"],
    deps: ["holochain-conductor-api", "tryorama" ]
  }
]


// bump("holochain", "bug-x-fix", "0000000")
bump("holochain:hdk", "hdk-bug-fix", "000000000")
