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

const formatBytesByUnit = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const units = ['Bytes', 'KB', 'MB', 'GB']
  const dm = decimals < 0
    ? 0
    : decimals
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return {
    size: parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)),
    unit: units[i]
  }
}

const toInt = (i) => {
  if (typeof i === 'string') return parseInt(i)
  else return i
}

module.exports = {
  parsePreferences,
  formatBytesByUnit,
  downloadFile
}
