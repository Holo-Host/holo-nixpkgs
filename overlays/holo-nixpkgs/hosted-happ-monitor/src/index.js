const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const { AppWebsocket } = require('@holochain/conductor-api');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const { HAPP_PORT, getAppIds } = require("./const")
const appId = await getAppIds().HHA

// Get Mongodb creds from file
if (!argv.configPath) throw new Error('hosted-happ-monitor requires --config-path option.');
let data = fs.readFileSync(`${argv.configPath}`)
let credentials = JSON.parse(data);
const username = credentials.MONGO_USERNAME;
const password = credentials.MONGO_PASSWORD;
const dbName = credentials.MONGO_DBNAME;

// Connection URL
const url = `mongodb+srv://${username}:${password}@cluster0.hjwna.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(url);

const main = async () => {

  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`);
  const appInfo = await appWebsocket.appInfo({ installed_app_id: appId });

  if (!appInfo) {
    throw new Error(`Couldn't find Holo Hosting App with id ${appId}`)
  };

  const cellId = appInfo.cell_data[0][0];

  const agentKey = cellId[1];

  const happs = await appWebsocket.callZome({
    cell_id: cellId,
    zome_name: 'hha',
    fn_name: 'get_happs',
    provenance: agentKey,
    payload: null
  });

  const happList = happs.map(happ => ({
    url: happ.happ_bundle.hosted_url,
    id: happ.happ_id
  }));

  return happList
};

const upload = async(happList) => {
  await client.connect()
  const db = client.db(dbName);
  const collection = db.collection('happ_list');

  let collection_list = await db.listCollections().toArray();
  if (collection_list.some(e => e.name === 'happ_list')) {
    await collection.drop();
  };
  await collection.insertMany(happList);
  await client.close();
}

main()
  .then(happList => upload(happList))
  .then(()=> process.exit())
  .catch(e => {
      console.error(e.message);
      process.exit(1);
  });