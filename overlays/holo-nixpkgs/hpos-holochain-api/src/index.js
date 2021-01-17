const fs = require('fs')
const express = require('express')
const app = express()
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const { UNIX_SOCKET } = require('./const')
const { callZome, createAgent, startHappInterface, listInstalledApps, installHostedDna } = require("./api")
const { parsePreferences } = require('./utils')

// TODO: Search from the list of installed happs
const CORE_ID = "core-happs:alpha0"

app.get('/hosted_happs', async (_, res) => {
  let happs
  try {
    console.log("CAlling happ lists");
    happs = await callZome(CORE_ID, 'hha', 'get_happs', null)
    console.log("Got happ lists: ", happs);
  } catch(e) {
      console.log("error from /hosted_happs:", e);
      res.sendStatus(501)
  }
  const presentedHapps = happs.map(happ => ({
    id: happ.happ_id,
    name: happ.happ_bundle.name
  }))
  res.send(presentedHapps)
})

// ??
app.post('/install_hosted_happ', async (req, res) => {
  let data
  // Loading body
  await req.on('data', (body) => {
    data = JSON.parse(body.toString())
  })

  // check if happ_id is passed else return error
  if (data.happ_id && data.preferences) {
    let happId = data.happ_id;
    // preferences: {
    //   max_fuel_before_invoice: "5", // how much holofuel to accumulate before sending invoice
    //   price_compute: "1",
    //   price_storage: "1",
    //   price_bandwidth: "1",
    //   max_time_before_invoice: [86400, 0], // how much time to allow to pass before sending invoice even if fuel trigger not reached.
    // }
    let preferences = data.preferences;
    if (!preferences.max_fuel_before_invoice
      || !preferences.max_time_before_invoice
      || !preferences.price_compute
      || !preferences.price_storage
      || !preferences.price_bandwidth) {
        console.log("wrong preferences...");
        return res.sendStatus(501)
    }
    console.log("Trying to install happ with happId: ", happId)

    // Steps:
    // - Call hha to get happ details
    let happBundleDetails;
    try {
      happBundleDetails = await callZome(CORE_ID, 'hha', 'get_happ', happId)
    } catch (e) {
      res.sendStatus(500)
    }
    console.log("Happ Bundle: ", happBundleDetails);
    let happAlias = happBundleDetails.happ_bundle.happ_alias;

    let listOfInstalledHapps;
    // Instalation Process:
    try {
      // Do we need to make sure app interface is started?
      // await startHappInterface();

      listOfInstalledHapps = await listInstalledApps();

      // Generate new agent
      // TODO: There should be only one hostedAgent for readonly instances
      const hostedAgentPubKey = await createAgent();

      // Install DNAs
      let dnas = happBundleDetails.happ_bundle.dnas;

      // check if the hosted_happ is already listOfInstalledHapps
      if (listOfInstalledHapps.includes(`${happBundleDetails.happ_id}`)) {
        console.log(`${happBundleDetails.happ_id}:${dnas[i].nick} already listOfInstalledHapps`)
        res.sendStatus(501);
      } else {
        const serviceloggerPref = parsePreferences(preferences, happBundleDetails.provider_pubkey)
        console.log("Parsed Preferences: ", serviceloggerPref);

        await installHostedDna(happBundleDetails.happ_id, dnas, hostedAgentPubKey, serviceloggerPref)
      }
      // Note: Do not need to install UI's for hosted happ
      res.sendStatus(200);
    } catch (e) {
      console.log("Falied to install hosted happ")
      res.sendStatus(501);
    }
  }
  else {
    console.log("Falied: Please pass in a happId ")
    res.sendStatus(501);
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

module.exports = {app}
