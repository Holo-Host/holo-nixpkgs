const yaml = require('js-yaml');
const fs = require('fs');

const HAPP_PORT = 42233;

const CONFIGURE_HC = process.env.NODE_ENV === 'test' ? './tests/config.yml' : '/var/lib/configure-holochain/config.yaml';

const getAppIds = async () => {
  try {
    let config = await yaml.load(fs.readFileSync(CONFIGURE_HC, 'utf8'))
    const getId = (id) => {
      let app = config.core_happs.find(h => h.app_id == id)
      if (app.uuid === undefined) {
        return `${id}:${app.version}`
      } else {
        return `${id}:${app.version}:${app.uuid}`
      }
    }
    if (process.env.NODE_ENV === 'test') return {
      HHA: config[0].app_name,
      SL: config[1].app_name
    }
    else return {
      HHA: getId('core-apps'),
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