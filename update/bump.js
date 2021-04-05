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
  console.log(`.... mock output from the bump script...`)
  console.log(`bump completed successfully`)
  // TODO stop if bump failed.
  mockGithub[github].repos[repo].branches[branch]+=1
  let newRev = mockGithub[github].repos[repo].branches[branch]
  console.log(`${repo}: commit yields new rev ${newRev}`)
  cmd(`git commit -am "Bump ${dep} to ${rev}"`)
  return newRev
}
const pushPullRequest = (github, repo, branch) => {
  console.log(`${repo}: looking for branch ${branch}`)
  cmd(`github ${github}/$repo pull-request ${branch} # TODO use actual github cli`)
  cmd(`git push`)
}

const awaitCI = (repo, branch) => {
  console.log(`${repo}: waiting for CI`)
  console.log(`${repo}: CI completed green`)
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
  let deps = spec.deps
  if (spec.multis) {
    for (const multi of spec.multis) {
      deps.concat(depSpecs[multi].repos)
    }
  }
  if (deps) {
    for (const d of deps) {
      let re = new RegExp(d)
      if (re.test(dep)) {
        return true
      }
    }
    return false
  }
}

const gatherRepos = (dep) => {
  console.log(`Gathering repos for: ${dep}`)
  let repos = {}
  for (const [repo, spec] of Object.entries(depSpecs)) {
    if (matchDeps(dep, spec)) {
      if (spec.multi) {
        for (const repo of spec.repos) {
          console.log(`looking for ${repo} in depSepc`, depSpecs[repo])
          repos[repo] = depSpecs[repo].github
        }
      } else {
        repos[repo] = spec.github
      }
    }
  }
  console.log(`Found:`, repos)
  return repos
}

const depSpecs = {
  "holochain-conductor-api": {
    github: "holochain",
    deps: ["holochain:api"]
  },
  "tryorama" : {
    github: "holochain",
    deps: ["holochain:hdk", "holochain-conductor-api" ]
  },
  "dna": {
    multi: true,
    repos: ["elemental-chat", "service-logger", "holofuel", "hha"],
    deps: ["holochain:hdk", "tryorama"]
  },
  "ui": {
    multi: true,
    repos: ["elemental-chat-ui"],
    deps: ["holochain-conductor-api", "tryorama" ]
  },
  "holo-nixpkgs": {
    github: "holo-host",
    deps: ["holochain:*", "hpos-configure-holochain"],
    multis: ["dna", "ui"]
  },
  "elemental-chat": {
    github: "holochain"
  },
  "elemental-chat-ui": {
    github: "holochain"
  },
  "service-logger": {
    github: "holo-host"
  },
  "holofuel": {
    github: "holo-host"
  },
  "hha": {
    github: "holo-host"
  }

}


// bump("holochain", "bug-x-fix", "0000000")
bump("holochain:hdk", "hdk-bug-fix", "000000000")
