#!/usr/bin/env node

const fs = require('fs')
const express = require('express')
const app = express()
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { UNIX_SOCKET, HAPP_PORT, ADMIN_PORT } = require('./const')
const { callZome, createAgent, listInstalledApps, installHostedHapp } = require('./api')
const { parsePreferences, formatBytesByUnit } = require('./utils')
const { getAppIds, getReadOnlyPubKey } = require('./const')
const { AdminWebsocket, AppWebsocket } = require('@holochain/conductor-api')
yargs(hideBin(process.argv))

app.get('/hosted_happs', async (timeInterval, res) => {
  let happs
  const appWs = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`)
  try {
    const APP_ID = await getAppIds()
    happs = await callZome(appWs, APP_ID.HHA, 'hha', 'get_happs', null)
  } catch (e) {
    console.log('error from /hosted_happs:', e)
    return res.status(501).send(`hpos-holochain-api error: ${e}`)
  }
  const presentedHapps = []
  for (let i = 0; i < happs.length; i++) {
    let appStats, enabled, sourceChains, duration, bandwidth, cpu, usage
    try {
      // nb: servicelogger bandwidth payload is calcalated with Bytes (not bits)
      appStats = await callZome(appWs, `${happs[i].happ_id}::servicelogger`, 'service', 'get_happ_usage', timeInterval)
      enabled = true
    } catch (e) {
      throw new Error(`Error calling get_stats from ${happs[i].happ_id}::servicelogger : `, e)
    }

    if (!appStats) {
      enabled = false
      sourceChains = 0
      usage = {}
    } else {
      ({ source_chain_count: sourceChains, duration, bandwidth, cpu } = appStats)
      bandwidth = formatBytesByUnit(bandwidth) // format bandwidth into object with highest appropriate unit of measurement and respective size (ie: { size: 1, unit: GB })
      usage = {
        duration,
        bandwidth,
        cpu
      }
    }

    presentedHapps.push({
      id: happs[i].happ_id,
      name: happs[i].happ_bundle.name,
      enabled,
      sourceChains,
      usage
    })
  }
  res.status(200).send(presentedHapps)
})

app.post('/install_hosted_happ', async (req, res) => {
  let data
  // Loading body
  await req.on('data', (body) => {
    data = JSON.parse(body.toString())
  })

  // check if happ_id is passed else return error
  if (data.happ_id && data.preferences) {
    const happId = data.happ_id
    // preferences: {
    //   max_fuel_before_invoice: "5", // how much holofuel to accumulate before sending invoice
    //   price_compute: "1",
    //   price_storage: "1",
    //   price_bandwidth: "1",
    //   max_time_before_invoice: [86400, 0], // how much time to allow to pass before sending invoice even if fuel trigger not reached.
    // }
    const preferences = data.preferences
    if (!preferences.max_fuel_before_invoice ||
      !preferences.max_time_before_invoice ||
      !preferences.price_compute ||
      !preferences.price_storage ||
      !preferences.price_bandwidth) {
      console.log('wrong preferences...')
      return res.status(501).send(`hpos-holochain-api error: preferences does not include all the necessary values`)
    }
    console.log('Trying to install happ with happId: ', happId)

    // Steps:
    // - Call hha to get happ details
    let happBundleDetails
    try {
      const APP_ID = await getAppIds()
      const appWs = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`)
      happBundleDetails = await callZome(appWs, APP_ID.HHA, 'hha', 'get_happ', happId)
    } catch (e) {
      return res.status(501).send(`hpos-holochain-api error: ${e}`)
    }
    console.log('Happ Bundle: ', happBundleDetails)

    let listOfInstalledHapps
    // Instalation Process:
    try {
      const adminWs = await AdminWebsocket.connect(`ws://localhost:${ADMIN_PORT}`)
      // Do we need to make sure app interface is started?
      // await startHappInterface(adminWs);

      listOfInstalledHapps = await listInstalledApps(adminWs)

      // Generate new agent in a test environment else read the location in hpos
      const hostPubKey = process.env.NODE_ENV === 'test' ? await createAgent(adminWs) : await getReadOnlyPubKey()

      // Install DNAs
      const dnas = happBundleDetails.happ_bundle.dnas

      // check if the hosted_happ is already listOfInstalledHapps
      if (listOfInstalledHapps.includes(`${happBundleDetails.happ_id}`)) {
        return res.status(501).send(`hpos-holochain-api error: ${happBundleDetails.happ_id} already installed on your holoport`)
      } else {
        const serviceloggerPref = parsePreferences(preferences, happBundleDetails.provider_pubkey)
        console.log('Parsed Preferences: ', serviceloggerPref)
        await installHostedHapp(happBundleDetails.happ_id, dnas, hostPubKey, serviceloggerPref)
      }
      // Note: Do not need to install UI's for hosted happ
      return res.status(200).send(`Successfully installed happ_id: ${happId}`)
    } catch (e) {
      return res.status(501).send(`hpos-holochain-api error: Failed to install hosted Happ with error - ${e}`)
    }
  } else {
    return res.status(501).send(`hpos-holochain-api error: Failed to pass happId in body`)
  }
})

try {
  if (fs.existsSync(UNIX_SOCKET)) {
    fs.unlinkSync(UNIX_SOCKET)
  }
} catch (err) {
  console.error(err)
}

app.listen(UNIX_SOCKET, () => {
  console.log(`Host console server running`)
})

module.exports = { app }
