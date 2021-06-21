const yaml = require('js-yaml')
const fs = require('fs')

const UNIX_SOCKET = process.env.NODE_ENV === 'test' ? 8800 : '/run/hpos-holochain-api/hpos-holochain-api.sock'

const ADMIN_PORT = 4444

const HAPP_PORT = 42233

const DEV_UID_OVERRIDE = process.env.DEV_UID_OVERRIDE

const CONFIGURE_HC = process.env.NODE_ENV === 'test' ? './tests/config.yaml' : '/var/lib/configure-holochain/config.yaml'
const READ_ONLY_PUBKEY = '/var/lib/configure-holochain/agent_key.pub'
const UI_STORE_FOLDER = '/var/lib/configure-holochain/hosted-uis'

const getReadOnlyPubKey = async () => {
  try {
    const key = await fs.readFileSync(READ_ONLY_PUBKEY, 'base64')
    return Buffer.from(key, 'base64')
  } catch (e) {
    console.log('Error ReadOnlyPubKey: ', e)
    throw new Error(e)
  }
}

const getAppIds = async () => {
  try {
    const config = yaml.load(fs.readFileSync(CONFIGURE_HC, 'utf8'))
    const getId = (name) => {
      const { bundle_url } = config.core_happs.find(h => h.bundle_url.includes(name))
      const bundleUrlPath = new URL(bundle_url).pathname
      const id =  bundleUrlPath.slice(bundleUrlPath.lastIndexOf('/') + 1)
        .replace('.happ', '')
        .replace('.', ':')
      if (DEV_UID_OVERRIDE) {
        return `${id}::${DEV_UID_OVERRIDE}`
      }
      return id
    }
    return {
      HHA: getId('core-app'),
      SL: getId('servicelogger')
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  UNIX_SOCKET,
  ADMIN_PORT,
  HAPP_PORT,
  DEV_UID_OVERRIDE,
  UI_STORE_FOLDER,
  getReadOnlyPubKey,
  getAppIds
}
