const express = require('express')
const app = express()
const { AppWebsocket } = require('@holochain/conductor-api')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

if (!argv.appPort) {
  throw new Error('Host console server requires --app-port option.')
}

if (!argv.appId) {
  throw new Error('Host console server requires --app-id option.')
}

const UNIX_SOCKET = '/run/host-console-server.sock'

app.get('/hosted_happs', async (_, res) => {
  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${argv.appPort}`)

  const appInfo = appWebsocket.appInfo({ app_id: argv.appId })

  if (!appInfo) {
    throw new Error (`Couldn't find Holo Hosting App with id ${ argv.appId }`)
  }

  const cellId = appInfo.cell_data[0][0]

  const agentKey = cellId[1]

  const happs = await appWebsocket.callZome({
    cellId,
    zome_name: 'hha',
    fn_name: 'get_happs',
    provenance: agentKey,
    payload: {}
  })

  const presentedHapps = happs.map(happ => ({
    id: happ.id,
    name: happ.name
  }))

  res.send(presentedHapps)
})

app.listen(UNIX_SOCKET, () => {
  console.log(`Host console server running`)
})
