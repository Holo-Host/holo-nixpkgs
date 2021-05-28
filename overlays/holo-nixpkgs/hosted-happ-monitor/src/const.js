const yaml = require('js-yaml');
const fs = require('fs');

const HAPP_PORT = 42233;

const CONFIGURE_HC = process.env.NODE_ENV === 'test' ? './tests/config.yml' : '/var/lib/configure-holochain/config.yaml';

const DEV_UID_OVERRIDE = process.env.DEV_UID_OVERRIDE

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
  HAPP_PORT,
  getAppIds
}