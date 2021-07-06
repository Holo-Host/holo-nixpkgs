const fs = require('fs')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const { MongoClient } = require('mongodb')

let client

module.exports.getDb = async () => {
  if (client) return client // return existing db connection if exists

  if (!argv.configPath)
    throw new Error('hosted-happ-monitor requires --config-path option.')

  let data = fs.readFileSync(`${argv.configPath}`)
  let credentials = await JSON.parse(data)
  const username = credentials.MONGO_USERNAME
  const password = credentials.MONGO_PASSWORD
  const dbName = credentials.MONGO_DBNAME

  // Connection URL
  const url = `mongodb+srv://${username}:${password}@cluster0.hjwna.mongodb.net/${dbName}?retryWrites=true&w=majority`

  // Open db connection and store it in global db (instanton pattern)
  console.log('Connecting to db...')
  client = new MongoClient(url, {
    useUnifiedTopology: true
  })
  await client.connect()
  client = client.db(dbName)
  return client
}

module.exports.closeDb = async () => {
  console.log('Disconnecting from db...')
  if (client) client.close()
}
