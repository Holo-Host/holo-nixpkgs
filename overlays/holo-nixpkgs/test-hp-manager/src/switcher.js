const { getTestHoloports, getHoloportDetails, disableUnswitchedHoloports } = require('./data-handler')
const { getAllPingResults } = require('./ping-utils')
const { closeDb } = require('./database')

async function run() {
  // Get all holoports registered for testing
  const testHoloports = await getTestHoloports()

  // Get their (and only their) {IP, name} from latest_zt_snap
  const holoportDetails = await getHoloportDetails(testHoloports)

  // Then loop through IPs and ssh-ping and record outcome
  // in a truly async style
  let channelSwitchResults = await getAllPingResults(holoportDetails, 'switchChannel')
  const failedSwitch = channelSwitchResults.filter(function(hp){ return !hp.success })
  console.log(`Failed to switch ${failedSwitch.length} holoports to channel`)
  console.log("Unswitched holoports are: \n", failedSwitch)
  await disableUnswitchedHoloports(failedSwitch)  
}

run()
  .then(()=> {
    closeDb()
    process.exit()
  })
  .catch(e => {
      console.error(e.message)
      closeDb()
      process.exit(1);
  })
