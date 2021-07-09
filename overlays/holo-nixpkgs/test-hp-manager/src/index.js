const { getTestHoloports, getHoloportDetails, insertPingResults } = require('./data-handler')
const { getAllPingResults } = require('./ping-utils')
const { closeDb } = require('./database')

async function run() {
  // Get all holoports registered for testing
  const testHoloports = await getTestHoloports()

  // Get their (and only their) {IP, name} from latest_zt_snap
  const holoportDetails = await getHoloportDetails(testHoloports)

  // Then loop through IPs and ssh-ping and record outcome
  // in a truly async style
  let pingResults = await getAllPingResults(holoportDetails, 'pingCheck')

  // Upload entries into collection test_holoports_ping_result
  await insertPingResults(pingResults)
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
