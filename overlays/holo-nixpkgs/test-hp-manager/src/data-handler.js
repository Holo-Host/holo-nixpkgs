const { getDb } = require('./database')

module.exports.getTestHoloports = async () => {
  let testHoloports = []

  const collection = await getCollection('test_holoports')
  const cursor = await collection.find({})

  await cursor.forEach((el) => {
    if (el.enabled) testHoloports.push(el.name)
  })

  return testHoloports
}

module.exports.getHoloportDetails = async (holoports) => {
  let holoportDetails = []

  const collection = await getCollection('performance_summary')
  const cursor = await collection.find({ name: { $in: holoports } })

  await cursor.forEach((el) => {
    holoportDetails.push({name: el.name, IP: el.zt_ipaddress})
  })

  const retrieved_hps = holoportDetails.map(a => a.name)
  console.log("Missing holoports are \n:", holoports.filter(e => !retrieved_hps.includes(e)) )

  return holoportDetails
}

module.exports.insertPingResults = async (pingResults) => {
  const collection = await getCollection('test_holoports_ping_result')
  const response = await collection.insertMany(pingResults)
  console.log(`Saving ${response.insertedCount} ping results in database`)
}

module.exports.disableUnswitchedHoloports = async (switchResults) => {
  const collection = await getCollection('test_holoports')
  const unswitchedHoloports = switchResults.map(a => a.name)
  const filter = {name:{$in: unswitchedHoloports}} 
  const update = { $set : {enabled : false } }
  const response = await collection.updateMany(filter, update)
  console.log(`Update ${response.modifiedCount} holoport records in database`)
}

getCollection = async (name) => {
  db = await getDb()
  return await db.collection(name);
}


// {
//   _id: { name: "$name", IP:"$IP"},
//   holoNet: {$last: "$holoNet"},
//   sshEntries: { 
//     $push:  { 
//       timestamp: {
//         $toDate: "$timestamp"
//       }, 
//       success: "$success" 
//       }
//     }
//  }

//  {
//   timestamp: 1
// }