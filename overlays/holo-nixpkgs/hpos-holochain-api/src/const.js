const yaml = require('js-yaml');
const fs = require('fs');

const UNIX_SOCKET = process.env.NODE_ENV === 'test' ? 8800 : '/run/hpos-holochain-api/hpos-holochain-api.sock';

const ADMIN_PORT = 4444;

const HAPP_PORT = 42233;

const CONFIGURE_HC = process.env.NODE_ENV === 'test' ? './tests/config.yml' : '/var/lib/configure-holochain/config.yaml';
const READ_ONLY_PUBKEY = '/var/lib/configure-holochain/agent_key.pub';

const getReadOnlyPubKey = async () => {
  try {
    let key = await fs.readFileSync(READ_ONLY_PUBKEY, 'base64')
    return Buffer.from(key, 'base64')
  } catch (e) {
    console.log("Error ReadOnlyPubKey: ", e);
    throw new Error(e)
  }
}

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
      HHA: getId('core-happs'),
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
  getReadOnlyPubKey,
  getAppIds
}