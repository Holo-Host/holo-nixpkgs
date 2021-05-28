const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const { AppWebsocket } = require('@holochain/conductor-api')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const { HAPP_PORT, getAppIds } = require("./const")

// Get Mongodb creds from file
if (!argv.configPath) throw new Error('hosted-happ-monitor requires --config-path option.')
let data = fs.readFileSync(`${argv.configPath}`)
let credentials = JSON.parse(data)
const username = credentials.MONGO_USERNAME
const password = credentials.MONGO_PASSWORD
const dbName = credentials.MONGO_DBNAME

// Connection URL
const url = `mongodb+srv://${username}:${password}@cluster0.hjwna.mongodb.net/${dbName}?retryWrites=true&w=majority`
const client = new MongoClient(url)

const main = async () => {
  const appIds = await getAppIds()
  const appId = appIds.HHA
  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`)
  const appInfo = await appWebsocket.appInfo({ installed_app_id: appId })

  if (!appInfo) {
    throw new Error(`Couldn't find Holo Hosting App with id ${appId}`)
  }

  const [{ cell_id }] = appInfo.cell_data
  const [_dnaHash, agentKey] = cell_id

  const happs = await appWebsocket.callZome({
    cell_id: cell_id,
    zome_name: 'hha',
    fn_name: 'get_happs',
    provenance: agentKey,
    payload: null
  })

  const happList = happs.map(happ => ({
    url: happ.happ_bundle.hosted_url,
    id: happ.happ_id
  }))
  
  if (happList.length === 0) {
    console.log("no happs published")
    return
  }

  await upload(happList, 'happ_list')
  console.log('happ list updated')

  for (const happ of happList) {
    const hostArray = await appWebsocket.callZome({
      cell_id: cell_id,
      zome_name: 'hha',
      fn_name: 'get_hosts',
      provenance: agentKey,
      payload: { id: happ.id }
    })

    const hostList = hostArray.map(host_id => ({
      id: host_id,
      preferences: ''
    }))

    await upload(hostList, `hosts_for_${happ.id}`) // We want 1 database per happ because later we'll have the various host preferences in it too
    console.log(`hosts updated for ${happ.id}`)
  }
}



const upload = async(data, collection_name) => {
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection(collection_name)

  let collection_list = await db.listCollections().toArray();
  if (collection_list.some(e => e.name === collection_name)) {
    await collection.drop()
  }
  await collection.insertMany(data)
  await client.close()
}

main()
  .then(()=> process.exit())
  .catch(e => {
      console.error(e.message)
      process.exit(1);
  })