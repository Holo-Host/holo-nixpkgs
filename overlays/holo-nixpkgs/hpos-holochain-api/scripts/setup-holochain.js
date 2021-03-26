const child_process = require('child_process')
const { promisify } = require('util')
const yaml = require('js-yaml')
const fs = require('fs')
const downloadFile = require('../src/utils.js')

const exec = promisify(child_process.exec)
const readFile = promisify(fs.readFile)

const newAgent = async () => {
  const agentKeyRegex = /(uhCAk[0-9A-Za-z_-]{48})/
  const { stdout } = await exec('hc sandbox call new-agent', {
    encoding: 'utf8'
  })
  return agentKeyRegex.exec(stdout)[1]
}

async function main () {
  await exec('hc sandbox clean')
  await exec('hc sandbox create')
  const agentPubKey = await newAgent()
  const { core_happs, self_hosted_happs } = yaml.load(
    await readFile('./tests/config.yaml', 'utf8')
  )
  for (const happ of core_happs) {
    const { bundle_url, ui_url } = happ
    const bundlePath = await downloadFile(bundle_url)

    await exec(
      `hc sandbox call install-app-bundle --agent-key '${agentPubKey}' --app-id '${appId}' '${bundlePath}'`
    )
  }
  console.log((await exec('hc sandbox call list-active-apps')).stdout)
}

main()
