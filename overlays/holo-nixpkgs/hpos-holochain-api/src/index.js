#!/usr/bin/env node

const fs = require('fs')
const express = require('express')
const app = express()
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
yargs(hideBin(process.argv))
const { UNIX_SOCKET, HAPP_PORT, ADMIN_PORT } = require('./const')
const { callZome, createAgent, listInstalledApps } = require('./api')
const { installHostedHapp, installHostedUI } = require('./install_hosted_happ')
const { registerECHapp } = require('./register_happ')
const { parsePreferences, isUsageTimeInterval } = require('./utils')
const { getAppIds, getReadOnlyPubKey } = require('./const')
const { AdminWebsocket, AppWebsocket } = require('@holochain/conductor-api')

const getPresentedHapps = async usageTimeInterval => {
  const appWs = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`)
  const APP_ID = await getAppIds()
  const happs = await callZome(appWs, APP_ID.HHA, 'hha', 'get_happs', null)

  const presentedHapps = []
  for (let i = 0; i < happs.length; i++) {
    const usage = {
      bandwidth: 0,
      cpu: 0
    }
    let appStats, enabled
    let happDetails = null
    try {
      appStats = await callZome(appWs, `${happs[i].happ_id}::servicelogger`, 'service', 'get_stats', usageTimeInterval)
      enabled = true
      const { source_chain_count: sourceChains, bandwidth, cpu, disk_usage: storage } = appStats
      usage.cpu = cpu
      usage.bandwidth = bandwidth
      // Create happ details with enabled true and servicelogger deatils
      happDetails = {
        id: happs[i].happ_id,
        name: happs[i].happ_bundle.name,
        bundleUrl: happs[i].happ_bundle.bundle_url,
        hostedUrl: happs[i].happ_bundle.hosted_url,
        enabled,
        sourceChains,
        usage,
        storage
      }
    } catch (e) {
      // Creat happ deatils with enabled false and and error for servicelogger
      happDetails = {
        id: happs[i].happ_id,
        name: happs[i].happ_bundle.name,
        bundleUrl: happs[i].happ_bundle.bundle_url,
        hostedUrl: happs[i].happ_bundle.hosted_url,
        enabled: false,
        error: {
          source: `${happs[i].happ_id}::servicelogger`,
          message: e.message,
          stack: e.stack
        }
      }
    }
    presentedHapps.push(happDetails)
  }
  return presentedHapps
}

app.get('/hosted_happs', async (req, res) => {
  const usageTimeInterval = {
    duration_unit: req.query.duration_unit,
    amount: Number(req.query.amount)
  }

  if (!isUsageTimeInterval(usageTimeInterval)) {
    return res.status(501).send('failed to provide proper time interval query params: expected duration_unit and amount')
  }

  try {
    const presentedHapps = await getPresentedHapps(usageTimeInterval)
    res.status(200).send(presentedHapps)
  } catch (e) {
    return res.status(501).send(`hpos-holochain-api error: ${e}`)
  }
})

app.get('/dashboard', async (req, res) => {
  const usageTimeInterval = {
    duration_unit: req.query.duration_unit,
    amount: Number(req.query.amount)
  }

  if (!isUsageTimeInterval(usageTimeInterval)) {
    return res.status(501).send('failed to provide proper time interval query params: expected duration_unit and amount')
  }

  try {
    const presentedHapps = await getPresentedHapps(usageTimeInterval)
    const enabledHapps = presentedHapps.filter(happ => happ.enabled)

    const dashboard = enabledHapps.reduce((acc, happ) => {
      const totalSourceChains = acc.totalSourceChains + happ.sourceChains
      const currentTotalStorage = acc.currentTotalStorage + happ.storage
      const cpu = acc.usage.cpu + happ.usage.cpu
      const bandwidth = acc.usage.bandwidth + happ.usage.bandwidth

      return {
        totalSourceChains,
        currentTotalStorage,
        usage: {
          cpu,
          bandwidth
        }
      }
    }, {
      totalSourceChains: 0,
      currentTotalStorage: 0,
      usage: {
        cpu: 0,
        bandwidth: 0
      }
    })

    res.status(200).send(dashboard)
  } catch (e) {
    return res.status(501).send(`hpos-holochain-api error: ${e}`)
  }
})

app.post('/install_hosted_happ', async (req, res) => {
  // Loading body
  const data = await new Promise(resolve => req.on('data', (body) => {
    resolve(JSON.parse(body.toString()))
  }))

  // check if happ_id is passed else return error
  if (data.happ_id && data.preferences) {
    const happId = data.happ_id
    // preferences: {
    //   max_fuel_before_invoice: '5', // how much holofuel to accumulate before sending invoice
    //   price_compute: '1',
    //   price_storage: '1',
    //   price_bandwidth: '1',
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
    console.log('DNAS', happBundleDetails.happ_bundle.dnas)
    let listOfInstalledHapps
    // Instalation Process:
    try {
      const adminWs = await AdminWebsocket.connect(`ws://localhost:${ADMIN_PORT}`)
      // Do we need to make sure app interface is started?
      // await startHappInterface(adminWs);

      listOfInstalledHapps = await listInstalledApps(adminWs)

      // Generate new agent in a test environment else read the location in hpos
      const hostPubKey = process.env.NODE_ENV === 'test' ? await createAgent(adminWs) : await getReadOnlyPubKey()
      // Since the happ_id is going be to received from the host url it needs to be lowercase
      console.log("Before: ", happBundleDetails.happ_id);
      let happ_id = happBundleDetails.happ_id.toLowerCase();
      console.log("After: ", happ_id);
      console.log("After agein: ", happ_id.toLowerCase());
      // check if the hosted_happ is already listOfInstalledHapps
      await installHostedUI(happ_id, happBundleDetails.happ_bundle.ui_src_url)

      if (listOfInstalledHapps.includes(`${happ_id}`)) {
        return res.status(501).send(`hpos-holochain-api error: ${happ_id} already installed on your holoport`)
      } else {
        const serviceloggerPref = parsePreferences(preferences, happBundleDetails.provider_pubkey)
        console.log('Parsed Preferences: ', serviceloggerPref)
        await installHostedHapp(happ_id, happBundleDetails.happ_bundle.bundle_url, hostPubKey, serviceloggerPref, data.membrane_proofs)
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

// This is a temporary function: eventually when the ui registeds happ it will call the zome call directly
// This currently only registers new EC happ as default
// You can pass a new url to the happ bundle that is the only thing needed
app.post('/register_happ', async (req, res) => {
  // Loading body
  const data = await new Promise(resolve => req.on('data', (body) => {
    resolve(JSON.parse(body.toString()))
  }))
  if (data.bundleUrl) {
    try {
      const happ = await registerECHapp(data.bundleUrl, data.uiUrl)
      res.status(200).send(happ)
    } catch (e) {
      return res.status(501).send(`hpos-holochain-api error: ${e}`)
    }

  } else {
    return res.status(501).send(`hpos-holochain-api error: Failed to pass url in body`)
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
