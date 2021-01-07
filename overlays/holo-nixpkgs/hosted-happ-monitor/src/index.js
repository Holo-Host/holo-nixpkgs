const mongoose = require('mongoose');
const { AppWebsocket } = require('@holochain/conductor-api')
const appPort = 42233
const appId = 'core-hha'

const main = async () => {

  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true})
  .then(()=>{
      console.log("mongodb is connected");
  })
  .catch((err)=>{
      console.log("mongodb not connected");
      console.log(err);
  })

  const appWebsocket = await AppWebsocket.connect(`ws://localhost:${appPort}`)
  const appInfo = appWebsocket.appInfo({ installed_app_id: appId })

  if (!appInfo) {
    throw new Error(`Couldn't find Holo Hosting App with id ${appId}`)
  }

  const cellId = appInfo.cell_data[0][0]

  const agentKey = cellId[1]

  const happs = await appWebsocket.callZome({
    cell_id: cellId,
    zome_name: 'hha',
    fn_name: 'get_happs',
    provenance: agentKey,
    payload: {}
  })

  const presentedHapps = happs.map(happ => ({
    id: happ.happ_id,
    name: happ.happ_bundle.name
  }))

  
}

main()
  .then(()=> process.exit())
  .catch(e => {
      console.error(e.message);
      process.exit(1);
  });
