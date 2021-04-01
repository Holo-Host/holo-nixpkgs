const tmp = require('tmp')
const request = require('request')
const fs = require('fs')

// Download from url to tmp file
// return tmp file path
const downloadFile = async (downloadUrl) => {
  console.log('Downloading url: ', downloadUrl)
  const fileName = tmp.tmpNameSync()
  const file = fs.createWriteStream(fileName)

  // Clean up url
  const urlObj = new URL(downloadUrl)
  urlObj.protocol = 'https'
  downloadUrl = urlObj.toString()

  return new Promise((resolve, reject) => {
    request({
      uri: downloadUrl
    })
      .pipe(file)
      .on('finish', () => {
        // console.log(`Downloaded file from ${downloadUrl} to ${fileName}`);
        resolve(fileName)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

const parsePreferences = (p, key) => {
  const mtbi = typeof p.max_time_before_invoice === 'string' ? JSON.parse(p.max_time_before_invoice) : p.max_time_before_invoice
  return {
    max_fuel_before_invoice: toInt(p.max_fuel_before_invoice),
    max_time_before_invoice: [toInt(mtbi[0]), toInt(mtbi[1])],
    price_compute: toInt(p.price_compute),
    price_storage: toInt(p.price_storage),
    price_bandwidth: toInt(p.price_bandwidth),
    provider_pubkey: key
  }
}

const toInt = i => {
  if (typeof i === 'string') return parseInt(i)
  else return i
}

const isUsageTimeInterval = value => {
  if (!value) return false
  const keys = Object.keys(value)
  return keys.includes('duration_unit') && keys.includes('amount')
}

// process the 'body' of the request, and parse it into JSON
// falling back to returning undefined either if no body is passed
// or the string fails to parse as valid JSON
const parseBodyData = req => {
  return Promise.race([
    new Promise(resolve => req.on('data', (body) => {
      try {
        resolve(JSON.parse(body.toString()))
      } catch (e) {
        console.error('Failed to parse request body:')
        console.log(e)
        resolve(undefined)
      }
    })),
    new Promise(resolve => setTimeout(() => resolve(undefined), 100))
  ])
}

module.exports = {
  parsePreferences,
  downloadFile,
  isUsageTimeInterval,
  parseBodyData
}
