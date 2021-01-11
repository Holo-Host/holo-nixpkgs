const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const { AppWebsocket } = require('@holochain/conductor-api');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const appPort = 42233;
const appId = 'core-hha';

// Get Mongodb creds from file
if (!argv.configPath) throw new Error('hosted-happ-monitor requires --config-path option.');

let credentials
fs.readFile(argv.configPath, (err, data) => {
    if (err) throw err;
    let credentials = JSON.parse(data);
});

const username = credentials.MONGO_USERNAME;
const password = credentials.MONGO_PASSWORD;
const dbName = credentials.MONGO_DBNAME;

// Connection URL
const url = `mongodb+srv://${username}:${password}@cluster0.hjwna.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(url);

const main = async () => {

  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${appPort}`);
  const appInfo = appWebsocket.appInfo({ installed_app_id: appId });

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
    payload: {}
  });

  const happList = happs.map(happ => ({
    url: happ.happ_bundle.hosted_url,
    id: happ.happ_id
  }));

  client.connect(async function(err) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection('happ_list');
    
    await collection.drop(function(err) {
      if(err) console.log('Error dropping happ_list: ', err)
    });

    await collection.insertMany(happList, function(err) {
      if(err) console.log('Error updating happ_list: ', err)
    });

    client.close();
  });
};

main()
  .then(()=> process.exit())
  .catch(e => {
      console.error(e.message);
      process.exit(1);
  });