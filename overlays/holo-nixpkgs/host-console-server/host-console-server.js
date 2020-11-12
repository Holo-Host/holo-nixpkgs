const express = require('express')
const app = express()
const { AdminWebsocket, AppWebsocket } = require('@holochain/conductor-api')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

if (!argv.admin_port) {
  throw new Error('Host console server requires --admin-port option.')
}

if (!argv.app_port) {
  throw new Error('Host console server requires --app-port option.')
}

if (!argv.hha_hash) {
  throw new Error('Host console server requires --hha-hash option.')
}

const UNIX_SOCKET = '/run/host-console-server.sock'

// TODO: write these functions
const cellIdhasDnaHash = dnaHash => cellId => true
const agentKeyFromCellId = cellId => cellId[0]

app.get('/hosted_happs', async (_, res) => {
  const adminWebsocket = await AdminWebsocket.connect(`ws://localhost:${argv.admin_port}`)

  const cellIds = await adminWebsocket.listCellIds()

  const hhaCellId = cellIds.find(cellIdhasDnaHash(argv.hha_hash))

  const agentKey = agentKeyFromCellId(hhaCellId)

  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${argv.app_port}`)

  const happs = await appWebsocket.callZome({
    cellId: hhaCellId,
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
