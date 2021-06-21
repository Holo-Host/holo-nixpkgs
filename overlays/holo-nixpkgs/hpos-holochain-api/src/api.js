const { HAPP_PORT } = require('./const')

const createAgent = async adminWebsocket => {
  try {
    const agentPubKey = await adminWebsocket.generateAgentPubKey()
    console.log(`Generated new agent ${agentPubKey.toString('base64')}`)
    return agentPubKey
  } catch (e) {
    console.log(`Error while generating new agent: ${e.message}.`)
  }
}

const listInstalledApps = async adminWebsocket => {
  try {
    const apps = await adminWebsocket.listActiveApps()
    console.log('listActiveApps app result: ', apps)
    return apps
  } catch (e) {
    console.error(`Failed to get list of active happs with error: `, e)
  }
}

const startHappInterface = async adminWebsocket => {
  try {
    console.log(`Starting app interface on port ${HAPP_PORT}`)
    await adminWebsocket.attachAppInterface({ port: HAPP_PORT })
  } catch (e) {
    console.log(`Error: ${e.message}, probably interface already started.`)
  }
}

const callZome = async (ws, installedAppId, zomeName, fnName, payload) => {
  const appInfo = await ws.appInfo({ installed_app_id: installedAppId })

  if (!appInfo) {
    throw new Error(`Couldn't find Holo Hosting App with id ${installedAppId}`)
  }
  const [{ cell_id }] = appInfo.cell_data
  const [_dnaHash, agentKey] = cell_id

  return ws.callZome({
    cell_id,
    zome_name: zomeName,
    fn_name: fnName,
    provenance: agentKey,
    payload
  })
}

module.exports = {
  callZome,
  startHappInterface,
  listInstalledApps,
  createAgent
}
