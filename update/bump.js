let mockGithub = {
    holochain: {
        repos: {}
    },
    holo-host: {
        repos: {}
    }
}
let mockGit = {}

const command = (cmd) =>{
    console.log(`MOCK: ${cmd}`)
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
        mockGithub[github].repos[repo] = {branches: {branch: 0 }}
    } else {
        console.log(`${repo}: found branch ${branch}, checking out`)
        cmd(`git checkout ${branch}`)
    }
}

const execUpdateFor = (dep, rev) = {
    console.log(`${repo}: updating ${dep} to rev ${rev}`)
    cmd(`scripts/bump.sh ${dep} ${rev}`)

    mockGithub[github].repos[repo].branches[branch]+=1
    let newRev = mockGithub[github].repos[repo].branches[branch]
    console.log(`${repo}: commit yields new rev ${newRev}`)
    cmd(`git commit -am "Bump ${dep} to ${rev}`)
}
const pushPullRequest = (github, repo, branch) = {
    console.log(`${repo}: looking for branch ${branch}`)
    cmd(`github pull-request ${branch}`) //TODO what's the github api for making a PR branch idempotently
    cmd(`git push`)
}

const awaitCI = (repo, branch) = {
    console.log(`${repo}: waiting for CI`)
    return true
}
const bumpRepo = (dep, github, repo, branch, rev) => {
    // idempotently clone repo, and create branch for bump
    checkoutOrCreateBranch(github, repo, branch, base)
    // run the local update script for the named dependency
    execUpdateFor(repo, dep, rev)
    // idempotently create a PR on the repo for the branch with the update
    pushPullRequest(repo, branch)
    // wait for
    if !awaitCI(repo, branch) {
        throw(`CI failed for ${dep} in ${repo}`)
    }
}


const depSpecs = [
    {
        repo: "holochain-conductor-api",
        github: "holochain",
        deps: ["holochain:api"]
    },
    {
        repo: "tryorama"
        github: "holochain",
        deps: ["holochain:hdk", "holochain-conductor-api" ]
    },
    {
        repo: "holo-nixpkgs",
        github: "holo-host",
        deps: ["holochain:*", "hpos-configure-holochain"]
    },
/*    {
        multi: "dna",
        repos: ["elemental-chat", "service-logger", "holofuel", "hha"],
        deps: ["holochain:hdk", tryorama]
    },
    {
        multi: "ui",
        repos: ["elemental-chat-ui"],
        deps: ["holochain-conductor-api", "tryorama" ]
    }*/
]

const bump = (dep, branch, rev) => {
    const repos = gatherRepos(dep)
    let deps = {}

    for [repo, github] in Object.entries(repos) {
        // bump a repo and save the rev as a dependency
        deps[repo] = bumpRepo(dep, github, repo, branch, rev)
    }

    // recursively bump any other deps
    for [subDep, subRev] in Object.entries(deps) {
        bump(subDep, branch, subRev)
    }

}

const matchDeps = (dep, spec) => {
    spec.deps.contains[dep]
}

const gatherRepos = (dep) => {
    let repos = {}
    for spec in depSpecs {
        if matchDeps(dep, spec) {
            repo[spec.repo] = spec.github
        }
    }
    return repos
}


// bump("holochain", "bug-x-fix", "0000000")
bump("holochain:hdk", "hdk-bug-fix", "000000000")
