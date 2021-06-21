const { ADMIN_PORT, HAPP_PORT, DEV_UID_OVERRIDE, getAppIds } = require('./const')
const { AdminWebsocket, AppWebsocket } = require('@holochain/conductor-api')
const { downloadFile, unzipFile } = require('./utils')
const msgpack = require('@msgpack/msgpack')
const util = require('util')

const installHostedUI = async (
  happId,
  uiSrcUrl
) => {
  console.log(`Downloading happ_id: ${happId} UI URL: ${uiSrcUrl}`)
  const uiPath = await downloadFile(uiSrcUrl)
  await unzipFile(happId, uiPath)
  console.log(`Installed UI for happ_id: ${happId}`)
}

// NOTE: this code assumes a single DNA per hApp.  This will need to be updated when the hApp bundle
// spec is completed, and the hosted-happ config Yaml file will also need to be likewise updated
const installHostedHapp = async (
  happId,
  bundleUrl,
  agentPubKey,
  serviceloggerPref,
  membraneProofs
) => {
  console.log('Installing hApp...', happId)
  // How to install a bundle
  // We need to download the bundle to a perticular location.
  // Use that location and install
  // NOTE: we also have to install a servicelogger instance
  // We need to know the path to the servicelogger
  // Use that servicelogger and install a new DNA with the properties set as
  // { properties: Array.from(msgpack.encode({"bound_dna_id":"uhC0kmrkoAHPVf_eufG7eC5fm6QKrW5pPMoktvG5LOC0SnJ4vV1Uv"})) }

  try {
    // Install via admin interface
    console.log('Connecting to admin port...')
    const adminWebsocket = await AdminWebsocket.connect(
      `ws://localhost:${ADMIN_PORT}`
    )
    console.log('Downloading bundle URL...', bundleUrl)

    const bundlePath = await downloadFile(bundleUrl)

    const payload = {
      path: bundlePath,
      agent_key: agentPubKey,
      installed_app_id: happId,
      membrane_proofs: membraneProofs || {},
      uid: DEV_UID_OVERRIDE
    }
    console.log('Installing happ: ', payload)
    const installedApp = await adminWebsocket.installAppBundle(payload)
    console.log('Activate happ...', installedApp)

    // Install servicelogger instance
    await installServicelogger(adminWebsocket, happId, serviceloggerPref)

    await adminWebsocket.activateApp({
      installed_app_id: installedApp.installed_app_id
    })
    console.log(
      `Successfully installed ${happId} (read-only instance and service logger) for key ${agentPubKey.toString(
        'base64'
      )}`
    )
  } catch (e) {
    console.log(`Failed to install happ bundle ${happId} with error: `, e)
    throw new Error(
      `Failed to install happ bundle ${happId} with error: ${util.inspect(e)}`
    )
  }
}

const installServicelogger = async (adminWebsocket, happId, preferences) => {
  console.log(
    `Starting installation process of servicelogger for hosted happ {${happId}}`
  )
  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`)
  // TODO: Get servicelogger appID
  const APP_ID = await getAppIds()
  const {
    cell_data: [
      {
        cell_id: [serviceloggerDnaHash, hostPubKey]
      }
    ]
  } = await appWebsocket.appInfo({ installed_app_id: APP_ID.SL })

  const installedApp = `${happId}::servicelogger`
  console.log(`Registering ${installedApp}...`)

  const registeredHash = await adminWebsocket.registerDna({
    hash: serviceloggerDnaHash,
    properties: Array.from(msgpack.encode({ bound_happ_id: happId }))
  })

  console.log(`Installing ${installedApp}...`)
  await adminWebsocket.installApp({
    agent_key: hostPubKey,
    installed_app_id: installedApp,
    dnas: [
      {
        nick: 'servicelogger',
        hash: registeredHash
      }
    ]
  })

  console.log(`Activating ${installedApp}...`)
  await adminWebsocket.activateApp({ installed_app_id: installedApp })
  return callZome(
    appWebsocket,
    installedApp,
    'service',
    'set_logger_settings',
    preferences
  )
}
module.exports = {
  installHostedHapp,
  installServicelogger,
  installHostedUI
}
