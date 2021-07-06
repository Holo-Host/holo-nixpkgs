const { getDb } = require('./database')

module.exports.getTestHoloports = async () => {
  let testHoloports = []

  const collection = await getCollection('test_holoports')
  const cursor = await collection.find({})

  await cursor.forEach((el) => {
    testHoloports.push(el.name)
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

  return holoportDetails
}

module.exports.insertPingResults = async (pingResults) => {
  const collection = await getCollection('test_holoports_ping_result')
  const response = await collection.insertMany(pingResults)
  console.log(`Saving ${response.insertedCount} ping results in database`)
}

// Not currently needed
// module.exports.cleanUpHoloportList = async (holoportDetails) => {
//   return [
//     { name: "dead_one", IP: "172.26.29.51" },
//     { name: "5j60okm4zt9elo8gu5u4qgh2bv3gusdo7uo48nwdb2d18wk59h", IP: "172.26.29.50" },
//     { name: "rkbpxayrx3b9mrslvp26oz88rw36wzltxaklm00czl5u5mx1w", IP: "172.26.134.99"}
//   ]
// }

getCollection = async (name) => {
  db = await getDb()
  return await db.collection(name);
}
